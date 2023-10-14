import { useEffect, useMemo, useRef, useState } from 'react';
import eyeIcon from './assets/icons/eye.svg';
import type { ChangeEventHandler } from 'react';
import './App.css';
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from '@chakra-ui/react';

function App() {
  const [heightInPixels, setHeightInPixels] = useState<number>();
  const [widthInPixels, setWidthInPixels] = useState<number>();
  const [screenHeight, setScreenHeight] = useState<number>();
  const [screenWidth, setScreenWidth] = useState<number>();
  const [distanceToScreen, setDistanceToScreen] = useState<number>();

  const [eyeIconImage, setEyeIcon] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = new Image();
    img.src = eyeIcon;
    img.onload = () => {
      setEyeIcon(img);
    };
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleHeightChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      setHeightInPixels(undefined);
    } else {
      setHeightInPixels(Number(e.target.value));
    }
  };

  const handleWidthChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      setWidthInPixels(undefined);
    } else {
      setWidthInPixels(Number(e.target.value));
    }
  };

  const handleSceenWidthChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      setScreenWidth(undefined);
    } else {
      setScreenWidth(Number(e.target.value));
    }
  };

  const handleSceenHeightChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      setScreenHeight(undefined);
    } else {
      setScreenHeight(Number(e.target.value));
    }
  };

  const handleDistanceChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === '') {
      setDistanceToScreen(undefined);
    } else {
      setDistanceToScreen(Number(e.target.value));
    }
  };

  /**
   * diagonal resolution based on heghtInPixels and widthInPixels
   */

  const calculatedDiagonalPiexels = useMemo(() => {
    if (heightInPixels && widthInPixels) {
      return Math.sqrt(heightInPixels ** 2 + widthInPixels ** 2);
    }
  }, [heightInPixels, widthInPixels]);

  /**
   * diagonal screen size based on screenHeight and screenWidth
   */
  const calculatedDiagonalScreenSize = useMemo(() => {
    if (screenHeight && screenWidth) {
      return Math.sqrt(screenHeight ** 2 + screenWidth ** 2);
    }
  }, [screenHeight, screenWidth]);

  /**
   * pixcel per centimeter based on diagonal resolution and diagonal screen size
   */
  const pixcelPerCentimeter = useMemo(() => {
    if (calculatedDiagonalPiexels && calculatedDiagonalScreenSize) {
      return calculatedDiagonalPiexels / calculatedDiagonalScreenSize;
    }
  }, [calculatedDiagonalPiexels, calculatedDiagonalScreenSize]);

  /**
   * centimter per degree based on distance to screen
   */
  const centimeterPerDegree = useMemo(() => {
    if (distanceToScreen) {
      return 2 * Math.tan(getTanFromDegrees(0.5)) * distanceToScreen;
    }
  }, [distanceToScreen]);

  /**
   * PPD (pixel per degree) based on diagonal resolution, diagonal screen size and distance to screen
   */
  const calculatedPPD = useMemo(() => {
    if (pixcelPerCentimeter && centimeterPerDegree) {
      return pixcelPerCentimeter * centimeterPerDegree;
    }
  }, [calculatedDiagonalPiexels, centimeterPerDegree]);

  const screenSizeInDegree = useMemo(() => {
    if (calculatedDiagonalScreenSize && distanceToScreen) {
      return (
        arcTanInDegrees(calculatedDiagonalScreenSize / 2 / distanceToScreen) * 2
      );
    }
  }, [distanceToScreen, calculatedDiagonalScreenSize]);

  function getTanFromDegrees(degrees: number) {
    return Math.tan((degrees * Math.PI) / 180);
  }

  function arcTanInDegrees(x: number) {
    return Math.atan(x) * (180 / Math.PI);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // width and height of canvas
      const width = canvas.width;
      const height = canvas.height;

      if (!distanceToScreen || !calculatedDiagonalScreenSize) {
        return;
      }

      // convertion scale from cm to px
      const scale = Math.min(
        (height - 50) / distanceToScreen,
        width / calculatedDiagonalScreenSize,
      );

      const distanceToScreenInPx = distanceToScreen * scale;
      const screenSizeInPx = calculatedDiagonalScreenSize * scale;

      console.log('distanceToScreenInPx', distanceToScreenInPx);
      console.log('screenSizeInPx', screenSizeInPx);

      console.log('eyeIcon', eyeIconImage);

      // 三角形の描画
      ctx.beginPath();
      ctx.moveTo(0, 0); // 左上の頂点
      ctx.lineTo(screenSizeInPx / 2, distanceToScreenInPx); // 下の頂点
      ctx.lineTo(screenSizeInPx, 0); // 右上の頂点
      ctx.closePath();
      ctx.stroke();

      // 三角形の間の角度表示の描画
      const angle = Math.atan(screenSizeInPx / 2 / distanceToScreenInPx);
      ctx.beginPath();
      ctx.arc(
        screenSizeInPx / 2,
        distanceToScreenInPx,
        30,
        -Math.PI / 2 - angle,
        -Math.PI / 2 + angle,
      );
      ctx.stroke();

      if (eyeIconImage) {
        ctx.drawImage(
          eyeIconImage,
          screenSizeInPx / 2 - 15,
          distanceToScreenInPx,
          30,
          30,
        );
      }
    }
  }, [distanceToScreen, calculatedDiagonalScreenSize]);

  return (
    <>
      <VStack id="base-container" h="100%" w="100%">
        <Flex backgroundColor="black" w="100%" p={2} pl={4}>
          <Text color="white" fontSize="2xl">
            PPD Calculator
          </Text>
        </Flex>
        <HStack w="100%" alignItems="flex-start">
          <VStack id="setting-area" spacing={4} flexGrow="1" pt={6}>
            <Text>解像度</Text>
            <HStack>
              <Box>
                <Text>縦 (ピクセル数)</Text>
                <Input
                  type="number"
                  value={heightInPixels}
                  onChange={handleHeightChange}
                />
              </Box>

              <Box>
                <Text>横 (ピクセル数)</Text>
                <Input
                  type="number"
                  value={widthInPixels}
                  onChange={handleWidthChange}
                />
              </Box>
            </HStack>

            <Text>スクリーンサイズ</Text>
            <HStack>
              <Box>
                <Text>縦 (cm)</Text>
                <Input
                  type="number"
                  value={screenHeight}
                  onChange={handleSceenHeightChange}
                />
              </Box>

              <Box>
                <Text>横 (cm)</Text>
                <Input
                  type="number"
                  value={screenWidth}
                  onChange={handleSceenWidthChange}
                />
              </Box>
            </HStack>

            <Box>
              <Text>画面までの距離 (cm)</Text>
              <Input
                type="number"
                value={distanceToScreen}
                onChange={handleDistanceChange}
              />
            </Box>
          </VStack>

          <VStack id="result-area" spacing={4} flexGrow="1" pt={6}>
            <Text>結果</Text>
            <Table variant="simple" w="80%">
              <Thead>
                <Tr>
                  <Th>項目</Th>
                  <Th>数値</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>対角線上のピクセル数</Td>
                  <Td>{calculatedDiagonalPiexels?.toFixed(2) ?? '-'}</Td>
                </Tr>
                <Tr>
                  <Td>対角線上のスクリーンサイズ</Td>
                  <Td>{calculatedDiagonalScreenSize?.toFixed(2) ?? '-'}</Td>
                </Tr>
                <Tr>
                  <Td>1cm当たりのピクセル数</Td>
                  <Td>{pixcelPerCentimeter?.toFixed(2) ?? '-'}</Td>
                </Tr>
                <Tr>
                  <Td>視野角1度あたりのcm</Td>
                  <Td>{centimeterPerDegree?.toFixed(2) ?? '-'}</Td>
                </Tr>
                <Tr>
                  <Td>スクリーンが占める視野角</Td>
                  <Td>{screenSizeInDegree?.toFixed(2) ?? '-'}</Td>
                </Tr>
                <Tr>
                  <Td>PPD (pixel per degree)</Td>
                  <Td>{calculatedPPD?.toFixed(2) ?? '-    '}</Td>
                </Tr>
              </Tbody>
            </Table>
          </VStack>
          <Box id="canvas-wrap" p={4}>
            <canvas width="300px" height="400px" ref={canvasRef}></canvas>
          </Box>
        </HStack>
      </VStack>
    </>
  );
}

export default App;
