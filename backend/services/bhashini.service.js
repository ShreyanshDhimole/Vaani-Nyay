const axios = require('axios');
const bhashiniConfig = require('../config/bhashini.config');

class BhashiniService {
  constructor() {
    this.headers = {
      'Authorization': `Bearer ${bhashiniConfig.inferenceApiKey}`,
      'udayat-key': bhashiniConfig.udyatKey,
      'Content-Type': 'application/json'
    };
  }

  async transcribeAudio(audioBuffer, sourceLanguage) {
    try {
      // For ASR API call
      const formData = new FormData();
      formData.append('audio', audioBuffer, 'recording.wav');
      
      const response = await axios.post(
        `${bhashiniConfig.baseUrl}${bhashiniConfig.endpoints.asr}`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'multipart/form-data'
          },
          params: {
            sourceLanguage,
            userId: bhashiniConfig.userId,
            pipelineId: bhashiniConfig.pipelineId
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Bhashini ASR Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async translateText(text, sourceLanguage, targetLanguage) {
    try {
      const payload = {
        input: [{ source: text }],
        config: {
          serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
          language: {
            sourceLanguage,
            targetLanguage
          }
        }
      };

      const response = await axios.post(
        `${bhashiniConfig.baseUrl}${bhashiniConfig.endpoints.translation}`,
        payload,
        {
          headers: this.headers,
          params: {
            userId: bhashiniConfig.userId,
            pipelineId: bhashiniConfig.pipelineId
          }
        }
      );

      return response.data.output[0].target;
    } catch (error) {
      console.error('Bhashini Translation Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async textToSpeech(text, language) {
    try {
      const response = await axios.post(
        `${this.baseUrl}${bhashiniConfig.endpoints.tts}`,
        {
          input: [{ source: text }],
          config: {
            ...bhashiniConfig.defaultConfig,
            input: {
              language: {
                sourceLanguage: language
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error) {
      console.error('Bhashini TTS Error:', error);
      throw error;
    }
  }
}

module.exports = new BhashiniService();