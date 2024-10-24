import sharp from 'sharp';
import fs from 'fs/promises';
import logger from '../logger/logger.js';

export const ImageSizes = {
  PRODUITS_IMAGE_SIZE: { width: 200, height: 200 },
  RESTAURANT_IMAGE_SIZE: { width: 1280, height: 720 },
};

async function convertToWebP(base64Image, size) {
  try {
    if (!base64Image) {
      // Lire l'image en tant que buffer
      const buffer = await fs.readFile('./utils/converter/default.jpg');

      // Convertir le buffer en base64
      // eslint-disable-next-line no-param-reassign
      base64Image = buffer.toString('base64');
    }

    // Convertir la base64 en Buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // Utiliser Sharp pour convertir en WebP
    const resultBuffer = await sharp(buffer)
      .resize(size)
      .webp()
      .toBuffer();

    return `data:image/webp;base64,${resultBuffer.toString('base64')}`;
  } catch (error) {
    logger.log('error', `Erreur lors de la conversion en base64 : ${error}`);
    throw error;
  }
}

export const image2WebpRestaurant = async (base64Data) => {
  try {
    return await convertToWebP(base64Data, ImageSizes.RESTAURANT_IMAGE_SIZE);
  } catch (error) {
    logger.log('error', `Erreur lors de la conversion en WebP : ${error}`);
    throw error;
  }
};

export const image2WebpProduits = async (base64Data) => {
  try {
    return await convertToWebP(base64Data, ImageSizes.PRODUITS_IMAGE_SIZE);
  } catch (error) {
    logger.log('error', `Erreur lors de la conversion en WebP : ${error}`);
    throw error;
  }
};
