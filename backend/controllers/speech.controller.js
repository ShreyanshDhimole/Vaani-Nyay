const bhashiniService = require('../services/bhashini.service');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

exports.processAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { sourceLanguage, targetLanguage = 'en' } = req.body;
    const audioBuffer = req.file.buffer;

    // Process audio with Bhashini
    const transcription = await bhashiniService.transcribeAudio(
      audioBuffer, 
      sourceLanguage, 
      targetLanguage
    );

    // Save to temporary file ye bhi kr skte hai
    const tempId = uuidv4();
    const tempPath = path.join(__dirname, '../temp', `${tempId}.json`);
    fs.writeFileSync(tempPath, JSON.stringify(transcription));

    res.json({
      success: true,
      transcription,
      tempId
    });
  } catch (error) {
    console.error('Audio processing error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error processing audio',
      details: error.message
    });
  }
};

exports.translateText = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    
    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const translation = await bhashiniService.translateText(
      text,
      sourceLanguage,
      targetLanguage
    );

    res.json({
      success: true,
      translation
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error translating text'
    });
  }
};