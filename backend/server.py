from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS as vectordb
from langchain.prompts import PromptTemplate
from langchain.embeddings.openai import OpenAIEmbeddings
from InstructorEmbedding import INSTRUCTOR
from langchain.embeddings import HuggingFaceInstructEmbeddings
from sentence_transformers import SentenceTransformer
from langchain.chains import LLMChain
from langchain import ConversationChain
import json
from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv
from flask_cors import CORS
from transformers import pipeline
import time

app = Flask(__name__)
CORS(app) 

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

raw_documents = TextLoader('knowledge_base.txt').load()
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=0, separator=".")
documents = text_splitter.split_documents(raw_documents)

db = vectordb.from_documents(documents, OpenAIEmbeddings())

history = []
history_size = 51 #keep this odd



def retrieve_info(query):
    similar_info = db.similarity_search(query, k = 4)
    contents = [doc.page_content for doc in similar_info]
    return contents



prompt = "You are Aibo the panda, a cute and friendly mental health support chatbot having a conversation with a human. \nIf you are asked a question that requires external information or if you don't know the answer, refer to the info given after the question. If the info is irrlevant, then ignore it. Give human like responses.\nUse the context from the entire conversation."

history.append({"role": "system", "content": prompt})

@app.route('/chatbot', methods=['POST'])
def chatbot():
    while True:
        data = request.json
        question = data['message']
        info = retrieve_info(question)
        context = " ".join(info)
        history.append({"role": "user", "content":  question + "\nIf you don't know the answer, refer to the following text from the information database for any relevant context/information:\n"+context })
        response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages = history)
        history.pop()
        history.append({"role": "user", "content": question})
        reply = response.choices[0].message.content
        history.append({"role": "assistant", "content": reply})
        while(len(history) > history_size):
            history.pop(1)
            history.pop(1)
        print("\n" + "Aibo: " + reply + "\n")
        print(history)
        return jsonify({"Answer" : reply})


@app.route('/mood', methods=['POST'])
def mood():
    data = request.get_json()
    text = data.get('entry')

    classes = ["Optimistic", "Pessimistic"]
    Model = "cross-encoder/nli-roberta-base"
    Task = "zero-shot-classification"
    sentiment_analysis = pipeline(model=Model, task=Task, from_pt=True)
    dict = sentiment_analysis(
        sequences=text, candidate_labels=classes, multi_label=False)
    arr = dict["scores"]
    index = arr.index(max(arr))
    index1 = dict["labels"].index("Optimistic")
    result = dict["labels"][index]  # class
    score = 10*(dict["scores"][index1])  # 1-10
    timee = time.ctime()

    print("result: " + result)
    print("score: " + str(score))
    # print("time: " + timee)

    # resolving path
    public_folder = "../frontend/public"
    file_path = os.path.join(public_folder, "tracker.json")

    try:
      with open(os.path.join(public_folder, "doctorinfo.json"), "r") as file:
        temp = json.load(file)
      temp[timee] = score

      with open(os.path.join(public_folder, "doctorinfo.json"), 'w') as file:
        json.dump(temp, file, indent=4)
    except:
      pass

    try:
      # Read existing data from the JSON file
      with open(file_path, "r") as file:
        existing_data = json.load(file)
      existing_data[timee] = score  # appending to json

      # Write the updated data back to the JSON file
      with open(file_path, 'w') as file:
        json.dump(existing_data, file, indent=4)
      return jsonify(message='Data appended to JSON file'), 200
    except Exception as e:
      return jsonify(message='Error appending to JSON file', error=str(e)), 500


@app.route('/read_tracker', methods=['GET'])
def read_tracker():
    # resolving path
    public_folder = "../frontend/public"
    file_path = os.path.join(public_folder, "tracker.json")
    try:
        with open(file_path, 'r') as file:
            trackerData = json.load(file)
        # do operations on this current json data

        dates = list(trackerData.keys())
        scores = list(trackerData.values())

        if(len(dates) < 2):
           return
        
        last_date = dates[-1]
        second_last_date = dates[-2]

        if last_date[:3] == second_last_date[:3]:
          dates.pop()
          last_score = scores.pop()
          second_last_score = scores.pop()
          average = (last_score + second_last_score) / 2
          scores.append(average)

          while len(dates) > 7:
            dates.pop(0)
            scores.pop(0)
        
        # Convert lists to a dictionary
        new_data = {}
        for i in range(len(dates)):
          new_data[dates[i]] = scores[i]

        # Write the updated data to a JSON file
        with open(file_path, "w") as file:
            json.dump(new_data, file, indent=4)
        return jsonify(new_data)
    
    except Exception as e:
        return jsonify({'error': 'Error reading JSON file'}), 500


if __name__ == '__main__':
  app.run(debug=True)
