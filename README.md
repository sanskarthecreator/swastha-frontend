# SWASTHA - Food Label Decision Support System

> Making food choices **safe, smart, and personalized** for people with medical conditions.

---

## 🚨 Problem

Millions of people with conditions like diabetes, high blood pressure, and heart issues rely on packaged food labels to make safe choices.

However:

* Food labels are written in **complex chemical terminology**
* Users cannot interpret ingredients like additives, preservatives, or hidden sugars
* Even health-conscious individuals make **wrong decisions despite reading labels**

👉 The problem is not lack of awareness —
**it’s lack of understanding.**

---

## 💡 Solution

We built a **Food Label Decision Support System** that:

📸 Scans food labels
🧾 Extracts ingredients using OCR
🧠 Analyzes them based on medical conditions
⚖️ Gives a clear decision:

* ✔ Safe
* ⚠ Risky
* ❌ Avoid


---

## 🎯 Key Features

* 🔍 Real-time label scanning
* 🧠 Ingredient intelligence engine
* 👤 Personalized analysis (based on disease)
* ⚖️ Clear decision output (Safe / Risky / Avoid)
* 💬 Simple explanations (no medical jargon)

---

## 🧪 Example Use Case

A person with diabetes finishes a workout and buys a “zero sugar” drink.

Instead of guessing:

* They scan the label
* The system analyzes ingredients
* Instantly tells if it’s safe or risky — and why

👉 No confusion. No guesswork.

---

## 🏗️ System Architecture

```
User → Scan Label → OCR → Ingredient Extraction → 
Ingredient Intelligence Engine → Decision Engine → Output
```

---

## ⚙️ Tech Stack

### Backend

* Node.js / FastAPI
* OCR (Tesseract / Tesseract.js)

### Logic

* Rule-based decision engine
* Ingredient risk classification

### Frontend

* React (optional for demo)

---

## 🧠 How It Works

1. User uploads or scans a food label
2. OCR extracts text from the image
3. Ingredients are parsed and cleaned
4. Each ingredient is analyzed against medical rules
5. Final decision is generated with explanation

---

## 📊 Decision Logic (Example)

```
Diabetes:
- Sugar → Avoid
- Glucose → Avoid
- Aspartame → Risky
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd food-label-ai
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
node src/index.js
```

or

```bash
uvicorn app.main:app --reload
```

---

## 📌 Future Scope

* 🔬 Advanced AI-based ingredient analysis
* 🌍 Multi-language label support
* 📱 Mobile app integration
* 🏥 Integration with healthcare providers

---

## ⚠️ Disclaimer

This system is a **decision-support tool**, not a medical diagnosis system.
Users should consult professionals for critical health decisions.

---

## 🏆 Hackathon Edge

* Solves a **real-world, high-impact problem**
* Provides **personalized, real-time decisions**
* Bridges the gap between **information and understanding**

---

## 🤝 Team

Built with passion to make everyday health decisions safer.

---

## ⭐ If you like this project, give it a star!

