// frey-frontend/src/App.jsx (Version avec React-Bootstrap)

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

// Importation des composants React-Bootstrap
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button'; // Optionnel, mais utile

// Importation des trois composants d'onglets (maintenant fonctionnels)
import DataAnalyzer from './DataAnalyzer';
import ContentGenerator from './ContentGenerator'; 

// --- 1. Composant Chatbot Minimal (Utilise maintenant les classes Bootstrap) ---
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
            const response = await axios.post(`${apiUrl}/api/chat`, {
                user_prompt: currentPrompt,
            });

            const freyResponse = response.data.response;
            const freyMessage = { role: 'model', content: freyResponse };
            setHistory(prev => [...prev, freyMessage]);

        } catch (error) {
            console.error("Erreur API:", error);
            const errorMessage = { 
                role: 'model', 
                content: `🚨 ERREUR: Impossible de joindre l'API Python. Vérifiez le serveur et le CORS.` 
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
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="loading text-center text-secondary">🤖 FREY est en train d'écrire...</div>}
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
                <Button type="submit" disabled={isLoading} variant="primary">
                    <span style={{fontSize: '1.2rem'}}>➤</span>
                </Button>
            </form>
        </div>
    );
};

// --- 2. Composant Principal de l'Application (Utilise le Composant Tabs de Bootstrap) ---
function App() {
    // Utiliser des clés de texte simples pour les onglets
    const [key, setKey] = useState('chat');
    
    // URL de votre API Python FastAPI
    const API_BASE_URL = 'http://localhost:8000'; 

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
                className="mb-3 custom-tabs" // 'custom-tabs' pour cibler avec CSS
            >
                <Tab eventKey="chat" title={<span className="fw-bold">💬 Chatbot Intelligent</span>}>
                    <Chatbot apiUrl={API_BASE_URL} />
                </Tab>
                
                <Tab eventKey="analyze" title={<span className="fw-bold">📊 Analyseur de Données</span>}>
                    <DataAnalyzer apiUrl={API_BASE_URL} />
                </Tab>

                <Tab eventKey="generate" title={<span className="fw-bold">✍️ Générateur de Contenu</span>}>
                    <ContentGenerator apiUrl={API_BASE_URL} />
                </Tab>
            </Tabs>
        </Container>
    );
}

export default App;