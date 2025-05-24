const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  const fileBuffer = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType: mimeType,
    },
  };
}

/**
 * 分析遺失物品圖片
 * @param {Object} req - 請求物件
 * @param {Object} res - 回應物件
 */
exports.analyzeItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "請提供物品圖片" });
    }

    const filePath = req.file.path;
    const imagePart = fileToGenerativePart(filePath, req.file.mimetype);

    const itemCategories = [
      "有價票券",
      "3C電子",
      "身分證件",
      "運動物品",
      "眼鏡服裝",
      "文具書籍",
      "保溫瓶",
      "手錶",
      "鑰匙",
      "雨傘",
      "其他",
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `你是一個專業的物品分析助手。請根據圖片分析這個遺失物品並提供以下資訊：
    1. 物品名稱
    2. 物品類別 (必須從以下選項中選擇一個: ${itemCategories.join(", ")})
    3. 3-6個關鍵字 (請使用繁體中文，用於搜尋)
    4. 物品描述 (請使用繁體中文，100字內左右的描述)，你要當作你是撿到遺失物的人像別人說明撿到什麼，而不是在介紹。
    
    請以JSON格式回覆，例如：
    {
      "title": "物品名稱",
      "category": "物品類別",
      "keywords": ["關鍵字1", "關鍵字2", "關鍵字3"],
      "description": "物品描述"
    }
    
    只回傳JSON格式，不要有其他文字。`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // 解析回應 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "無法從 AI 回應解析資訊" });
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error("分析物品時發生錯誤:", error);
    return res
      .status(500)
      .json({ message: "分析物品時發生錯誤", error: error.message });
  }
};

/**
 * 分析食物圖片
 * @param {Object} req - 請求物件
 * @param {Object} res - 回應物件
 */
exports.analyzeFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "請提供食物圖片" });
    }

    const filePath = req.file.path;
    const imagePart = fileToGenerativePart(filePath, req.file.mimetype);

    const foodCategories = [
      "即期品",
      "水果",
      "蔬菜",
      "飲料",
      "零食",
      "烘焙食品",
      "剩菜",
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `你是一個專業的食物分析助手。請根據圖片分析這個食物並提供以下資訊：
    1. 食物名稱
    2. 食物類別 (必須從以下選項中選擇一個: ${foodCategories.join(", ")})
    3. 食物描述 (請使用繁體中文，100字內的簡短敘述，你要當作你是要分享吃不完食物的人，而不是在介紹食物。)
    
    請以JSON格式回覆，例如：
    {
      "title": "食物名稱",
      "category": "食物類別",
      "description": "食物描述"
    }
    
    只回傳JSON格式，不要有其他文字。`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // 解析回應 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: "無法從 AI 回應解析資訊" });
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    // 回傳結果
    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error("分析食物時發生錯誤:", error);
    return res
      .status(500)
      .json({ message: "分析食物時發生錯誤", error: error.message });
  }
};
