import { useMemo, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import './App.css';
import {
  Box,
  VStack,
  HStack,
  Input,
  Text,
  Divider,
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

  function getTanFromDegrees(degrees: number) {
    return Math.tan((degrees * Math.PI) / 180);
  }

  return (
    <>
      <VStack spacing={4}>
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

        <Divider />

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>項目</Th>
              <Th>数値</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>対角線上のピクセル数</Td>
              <Td>{calculatedDiagonalPiexels?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>対角線上のスクリーンサイズ</Td>
              <Td>{calculatedDiagonalScreenSize?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>1cm当たりのピクセル数</Td>
              <Td>{pixcelPerCentimeter?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>視野角1度あたりのcm</Td>
              <Td>{centimeterPerDegree?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>PPD (pixel per degree)</Td>
              <Td>{calculatedPPD?.toFixed(2)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </>
  );
}

export default App;
