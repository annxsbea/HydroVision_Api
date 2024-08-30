import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.API_KEY; // Certifique-se de definir a variável de ambiente API_KEY

// Inicialize a instância do GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(API_KEY);

async function getMeasureValueFromImage(base64Image: string): Promise<number> {
    try {
        // Defina o modelo e o payload para a API
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Faça a solicitação para obter o valor da medida a partir da imagem
        const response = await model.generate({
            // Adapte o payload conforme o modelo e o serviço da API
            inputs: { image: base64Image }
        });

        // Extraia e retorne o valor da medida da resposta
        const measureValue = response.data.measureValue; // Ajuste conforme a estrutura da resposta da API
        return measureValue;
    } catch (error) {
        // Lidar com erros de forma adequada
        if (error.response) {
            console.error('Erro na solicitação para a API do Google Generative AI:', error.response.data);
        } else {
            console.error('Erro desconhecido:', error);
        }
        throw new Error('Failed to get measure value from image');
    }
}

export { getMeasureValueFromImage };
