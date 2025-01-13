## **Stylumia NXT 2024 Hackathon Presentation**

### **Team Details**
- **Team Name**: Squirtles
- **PPT Link**: [Stylumia NXT 2024 Presentation](https://he-s3.s3.amazonaws.com/media/sprint/stylumia-nxt-hackathon-2024/team/2209568/e76827apresentation.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6I2ISGOYMPJGUFGY%2F20250113%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250113T153602Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ff01edd427202e3d5a2e48bc97f2c625da7d1d5ca159d6c0c877fd16854e25a4)

---

### **Executive Summary**
The fashion industry's complexity necessitates a **Universal Ontology and AI-Driven Feature Extraction System** capable of seamlessly integrating diverse data modalities. This innovative solution addresses significant challenges such as scalability, contextual interpretation, and temporal dynamics, ultimately transforming the way fashion is categorized and experienced.

---

### **Key Solution Highlights**

1. **Fashion Ontology Development**:
   - Create a comprehensive, hierarchical framework to standardize and organize fashion categories.
   - Ensure seamless integration of new trends and features.

2. **Multi-Modal AI Integration**:
   - Combine advanced techniques in computer vision, natural language processing, and real-time data analytics.
   - Enable accurate feature extraction from images, textual descriptions, and real-time APIs.

3. **Agentic Workflow Implementation**:
   - Design a dynamic, feedback-driven workflow where AI agents adapt based on user preferences.
   - Enhance accuracy and user experience without relying solely on expert insights.

4. **Innovative Tools**:
   - Incorporate virtual try-on systems for a personalized shopping experience.
   - Develop Avatar Try-On features to allow users to virtually try on outfits and accessories.
   - Provide real-time insights into global fashion trends.

---

### **Results and Impacts**
This project aims to revolutionize the fashion industry by introducing groundbreaking innovations that:

- **Enhance Categorization**: Improve categorization for diverse products like apparel, sneakers, and jewelry.
  
- **Enable Trend Forecasting**: Provide real-time insights to help brands align with market demands.

- **Personalize Consumer Experience**: Offer hyper-personalized recommendations based on user preferences.

---

## **System Architecture Documentation**

### **Explanation of the Architecture**
The architecture of the Stylumia solution is designed for modularity, scalability, and adaptability, meeting the complex demands of the fashion industry:

1. **Ontology Development**:
   - Acts as the backbone of the system with a comprehensive structure for fashion features.
   - Utilizes Neo4j for graph-based visualization to effectively map relationships between categories.

2. **Data Ingestion Pipeline**:
   - Facilitates integration of multi-modal data from various sources including images and APIs.
   - Employs Python libraries for data cleaning and transformation.

3. **Feature Extraction Engine**:
   - Analyzes both visual and textual data using AI algorithms to extract meaningful attributes.

4. **Learning & Feedback Engine**:
   - Integrates continuous learning mechanisms to refine processes based on user interactions.

5. **Virtual Try-On Extension**:
   - Empowers users to visualize fashion items on their images with accurate recommendations.

6. **AI Dashboard**:
   - Serves as the central hub for analytics showcasing trend forecasts and user preferences.

7. **Avatar Try-On Feature**:
   - Allows users to create personalized avatars for an immersive experience.

---

### **Architecture Diagram**

![Screenshot 2025-01-12 184722](https://github.com/user-attachments/assets/c757764c-a00f-4a13-8d19-3d89d59a35a8)

---

## **Detailed Project Features**

1. **Trend Analyzer**
   - Utilizes JVectorMSP and Gemini Transformer for precise trend analysis.
   - Integrates YouTube APIs for analyzing top-trending fashion shorts.

2. **Fashion Ontology**
   - Graph visualization powered by Neo4j showcasing intricate interconnections between categories.

3. **Feature Extraction**
   - Text processing using TF-IDF for tokenization and advanced NLP models for contextual meaning.

4. **Virtual Try-On**
   - Cloud-based storage utilizing UploadThing for secure user image storage.

5. **Smart Recommendation Engine**
   - Data-driven insights generating hyper-personalized fashion suggestions based on historical data.

6. **Agentic Feedback Bot**
   - Collects user feedback to refine feature extraction processes dynamically.

7. **AI Dashboard**
   - Displays real-time global trends and user behavior metrics powered by advanced analytics tools.

8. **Avatar Try-On**
   - Users can create customizable avatars representing their body shape and style preferences.

---

## **Technical Implementation Details**

### Model Architecture Description
- Combines TF-IDF Vectorizer for text tokenization with ResNet50 for visual classification.
- Powered by Neo4j for effective representation of relationships in the ontology.

### Feature Extraction Methodology

1. **Data Preprocessing**:
    - Clean datasets using pandas and NumPy.
    - Tokenize descriptions using TF-IDF to standardize textual data across categories.

2. **Image Analysis**:
    - Identify key visual features using TorchVision transformers and ResNet50.
  
3. **Integration of Textual and Visual Data**:
    - Merge textual features with visual features to enable compatibility between the two formats.

---

## **Setup Instructions**

This guide provides a detailed step-by-step process for setting up the Stylumia project, which consists of the frontend, backend, and virtual try-on Chrome extension components. Follow these instructions carefully to ensure successful installation and configuration of all components.

### Frontend Setup
The frontend is built using React.js:

1. Clone the Frontend Repository
    ```bash
    git clone https://github.com/CroWzblooD/Stylumia-Frontend.git
    cd Stylumia-Frontend
    ```

2. Install Dependencies
    Ensure Node.js and npm are installed, then run:
    ```bash
    npm install
    ```

3. Configure Environment Variables
    Create a `.env` file in your frontend directory with the following content:

    ```
    FAL_KEY=your_fal_ai_key
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
    NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
    NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
    NEXT_PUBLIC_GOOGLE_BLOG_API_KEY=your_google_blog_api_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    ```

4. Start the Frontend Server
    ```bash
    npm run dev
    ```
Your application should now be running at [http://localhost:3000](http://localhost:3000).

### Backend Setup
The backend is built using FastAPI:

1. Clone the Backend Repository
    ```bash
    git clone https://github.com/CroWzblooD/Stylumia-Backend.git
    cd Stylumia-Backend
    ```

2. Create a Virtual Environment
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install Dependencies
    Install the required Python packages listed in `requirements.txt`:

    ```
    fastapi[all]>=0.104.1
    uvicorn==0.24.0
    pandas==2.1.3
    python-multipart==0.0.6
    pydantic==2.5.2
    transformers>=4.30.0
    torch>=2.0.0
    spacy>=3.5.0
    numpy>=1.24.0
    sentence-transformers==2.2.2
    huggingface-hub==0.16.4
    faiss-cpu==1.7.4
    scikit-learn==0.24.2
    ```

4. Configure Environment Variables 
Create a `.env` file in your backend directory with the following content:

```
FAL_KEY=your_fal_ai_key

NEO4J_URI=neo4j+s://your_neo4j_uri 
NEO4J_USER=your_neo4j_user 
NEO4J_PASSWORD=your_neo4j_password 

AZURE_VISION_KEY=your_azure_vision_key 
AZURE_VISION_ENDPOINT=https://stylumia.cognitiveservices.azure.com/
```

5. Run the Backend Server 
Start the main server:
```bash 
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 
```
Start the ontology server:
```bash 
python src/ontology_server.py 
```
Your backend server should now be accessible at [http://localhost:8000](http://localhost:8000).

### Virtual Try-On Extension Setup

1. Create Extension Folder 
```bash 
mkdir stylumia-extension 
cd stylumia-extension 
```

2. Create Manifest File (manifest.json) 
Include necessary content as specified in your project documentation.

3. Load Extension in Chrome 
Open Google Chrome, navigate to `chrome://extensions/`, enable “Developer mode”, click “Load unpacked” and select your `stylumia-extension` folder.

### Running the Virtual Try-On Server

Ensure your backend server is running as described before starting any specific server-side logic related to your extension.

---

## Conclusion

You have now successfully set up the Stylumia project, including both frontend and backend components as well as the virtual try-on extension! If you encounter any issues, refer back to this guide or check relevant documentation for troubleshooting tips.

---

## Links

- Backend Repository: [Stylumia Backend](https://github.com/CroWzblooD/Stylumia-Backend)
- Chrome Extension Repository: [Stylumia Extension](https://github.com/CroWzblooD/Stylumia-Extension)
- Presentation PDF: [Stylumia NXT 2024 Presentation](https://he-s3.s3.amazonaws.com/media/sprint/stylumia-nxt-hackathon-2024/team/2209568/e76827apresentation.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6I2ISGOYMPJGUFGY%2F20250113%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250113T153602Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=ff01edd427202e3d5a2e48bc97f2c625da7d1d5ca159d6c0c877fd16854e25a4)
