module.exports = {
  udyatKey: process.env.BHASHINI_UDYAT_KEY,      
  inferenceApiKey: process.env.BHASHINI_INFERENCE_KEY,  
  userId: process.env.BHASHINI_USER_ID,           
  pipelineId: process.env.BHASHINI_PIPELINE_ID,  
  
  baseUrl: 'https://uday.bhashini.gov.in',
  endpoints: {
    asr: '/inference/asr',
    translation: '/inference/translation',
    tts: '/inference/tts'
  },
  languages: {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi'
  },
  defaultConfig: {
    pipelineTasks: ['asr'],
    input: {
      language: {
        sourceLanguage: 'hi' // Default source language
      }
    }
  }
};