// frey-frontend/src/App.jsx (Version avec React-Bootstrap)

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

// 🎯 NOUVEL IMPORT CRITIQUE : Pour afficher le contenu formaté du Chatbot
import ReactMarkdown from 'react-markdown'; 

// Importation des composants React-Bootstrap
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'; // Ajout de Spinner pour le Chatbot

// Importation des trois composants d'onglets (maintenant fonctionnels)
import DataAnalyzer from './DataAnalyzer';
import ContentGenerator from './ContentGenerator'; 

// --- 1. Composant Chatbot Amélioré ---
const Chatbot = ({ apiUrl }) => {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userMessage = { role: 'user', content: prompt };
        setHistory(prev => [...prev, userMessage]);
        const currentPrompt = prompt;
        setPrompt('');
        setIsLoading(true);

        try {
            // Pas de middleware d'encodage nécessaire ici.
            const response = await axios.post(`${apiUrl}/api/chat`, {
                user_prompt: currentPrompt,
            });

            const freyResponse = response.data.response;
            const freyMessage = { role: 'model', content: freyResponse };
            setHistory(prev => [...prev, freyMessage]);

        } catch (error) {
            console.error("Erreur API:", error);
            
            // Gestion d'erreur améliorée
            const errorDetail = error.response?.data?.detail || "Vérifiez la connexion ou le statut de l'API Render.";
            const errorMessage = { 
                role: 'model', 
                content: `🚨 ERREUR: Impossible de joindre l'API Python. Détail: ${errorDetail}` 
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <h3 className="mb-4 text-primary">💬 Chatbot Intelligent (Conversationnel)</h3>
            <div className="alert alert-info status-info">
                Posez-moi des questions.
            </div>
            
            {/* Historique du chat */}
            <div className="chat-history shadow-sm">
                {history.length === 0 && <p className="text-center text-muted pt-5">Dites quelque chose à FREY...</p>}
                {history.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <span className="avatar">{msg.role === 'user' ? '👤' : '🤖'}</span>
                        <div className="message-content">
                            <div className={`p-2 rounded ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-light border'}`}>
                                {/* ✅ CORRECTION: Utilisation de ReactMarkdown pour les messages du modèle */}
                                {msg.role === 'model' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Indicateur de chargement du Chatbot */}
                {isLoading && (
                    <div className="loading text-center text-secondary">
                        <Spinner animation="border" size="sm" className="me-2" />
                        🤖 FREY est en train d'écrire...
                    </div>
                )}
            </div>

            {/* Formulaire de saisie */}
            <form onSubmit={handleSubmit} className="chat-form d-flex mt-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Dites quelque chose à FREY..."
                    disabled={isLoading}
                    className="form-control me-2"
                />
                <Button type="submit" disabled={isLoading || !prompt.trim()} variant="primary" className="primary-button">
                    <span style={{fontSize: '1.2rem'}}>➤</span>
                </Button>
            </form>
        </div>
    );
};

// --- 2. Composant Principal de l'Application ---
function App() {
    const [key, setKey] = useState('chat');
    
    // URL de votre API Python FastAPI
    const API_BASE_URL = 'https://frey-ia.onrender.com'; 

    return (
        // Utilisation du Container de Bootstrap pour la réactivité
        <Container className="app-container my-5 p-4 bg-white shadow-lg">
            <h1 className="main-title border-bottom pb-2 mb-1">✨ FREY : Intelligence Artificielle Multifonction</h1>
            <p className="subtitle text-muted mb-4 ps-4">👋 Professionnelle, bienveillante et inspirante, je suis prête à vous aider à comprendre, analyser et créer.</p>

            {/* Système d'Onglets de React-Bootstrap */}
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3 custom-tabs" 
            >
                <Tab eventKey="chat" title={<span className="fw-bold">💬 Chatbot Intelligent</span>}>
                    {/* Le Chatbot gère la connexion à /api/chat */}
                    <Chatbot apiUrl={API_BASE_URL} />
                </Tab>
                
                <Tab eventKey="analyze" title={<span className="fw-bold">📊 Analyseur de Données</span>}>
                    {/* DataAnalyzer gère la connexion à /api/analyze, avec le middleware de sauts de ligne intégré (dans DataAnalyzer.jsx) */}
                    <DataAnalyzer apiUrl={API_BASE_URL} />
                </Tab>

                <Tab eventKey="generate" title={<span className="fw-bold">✍️ Générateur de Contenu</span>}>
                    {/* ContentGenerator gère la connexion à /api/generate */}
                    <ContentGenerator apiUrl={API_BASE_URL} />
                </Tab>
            </Tabs>
        </Container>
    );
}

export default App;
