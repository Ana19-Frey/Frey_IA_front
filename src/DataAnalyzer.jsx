// frey-frontend/src/DataAnalyzer.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // 👈 NOUVEL IMPORT pour afficher le Markdown
import axios from 'axios';
// Importation des composants Bootstrap pour le style et l'UX
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';

// Composant pour l'Analyseur de Données
const DataAnalyzer = ({ apiUrl }) => {
    const [dataInput, setDataInput] = useState('');
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!dataInput.trim()) {
            setError("Veuillez coller des données pour commencer l'analyse.");
            setReport('');
            return;
        }

        setIsLoading(true);
        setError('');
        setReport('');

        try {
            // 🎯 CORRECTION CRITIQUE : Nettoyage et encodage des sauts de ligne
            // Remplace tous les types de sauts de ligne (\r\n, \r, \n) par le caractère d'échappement \n.
            // Ceci est essentiel pour que le JSON soit valide et que Pandas puisse lire les lignes.
            const encodedData = dataInput.replace(/\r\n|\r|\n/g, '\n'); 

            // L'API attend un objet JSON avec le champ "data_input"
            const response = await axios.post(`${apiUrl}/api/analyze`, {
                data_input: encodedData, // <-- ENVOI DES DONNÉES ENCODÉES
            });

            if (response.data.success) {
                // Le rapport est dans le champ 'report' de la réponse API
                setReport(response.data.report);
            }

        } catch (err) {
            console.error("Erreur lors de l'analyse:", err);
            
            // Tente d'extraire le message d'erreur de l'API (FastAPI)
            const apiErrorMessage = err.response?.data?.detail || "Erreur de connexion ou traitement inconnu par l'API.";
            setError(`🚨 Échec de l'analyse : ${apiErrorMessage}`);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tab-content"> 
            
            {/* Titre et Info (Utilise les classes Bootstrap pour l'esthétique) */}
            <h3 className="text-primary">📊 Analyseur Automatique de Données</h3>
            <Alert variant="info" className="status-info">
                Collez vos données tabulaires (CSV, tabulé) ou téléversez un fichier pour une analyse par l'API Python.
            </Alert>
            
            {/* Affichage des Erreurs (Bootstrap Alert danger) */}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3 data-analyzer-form-container">
                <Form.Label className="fw-bold text-dark">Collez vos Données CSV ou Tabulées ici :</Form.Label>
                {/* ⚠️ Utilisation du composant Form.Control de Bootstrap */}
                <Form.Control
                    as="textarea"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder="Coller vos données CSV ou tabulées ici... (Ex: Nom,Age,Ville\nAlice,30,Paris)"
                    rows={8}
                    // Le style dans App.css cible cette classe pour augmenter la hauteur
                    className="form-control" 
                    disabled={isLoading}
                />
            </Form.Group>
            
            {/* ⚠️ Utilisation du composant Button de React-Bootstrap */}
            <Button 
                onClick={handleAnalyze} 
                disabled={isLoading} 
                variant="primary" 
                // La classe primary-button applique le dégradé sophistiqué de App.css
                className="primary-button mb-4" 
            >
                {isLoading ? (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Analyse en cours...
                    </>
                ) : (
                    'Analyser les Données'
                )}
            </Button>
            
            {/* --- Zone de Résultat --- */}
            {report && (
                <div className="result-box mt-4">
                    <div className="text-primary mb-3 fw-bold">Rapport d'Analyse FREY :</div>
                    {/* ✅ CORRECTION : Utilisation de ReactMarkdown pour afficher le rapport de manière structurée et sécurisée */}
                    <ReactMarkdown>{report}</ReactMarkdown>
                    
                </div>
            )}
        </div>
    );
};

export default DataAnalyzer;
