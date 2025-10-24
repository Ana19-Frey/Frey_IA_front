// frey-frontend/src/ContentGenerator.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // 👈 Import de ReactMarkdown
import axios from 'axios';
// Importation des composants React-Bootstrap
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Liste des tons disponibles (doit correspondre à la logique côté API si nécessaire)
const TONS = ['Professionnel', 'Amical', 'Drôle', 'Inspirant'];

const ContentGenerator = ({ apiUrl }) => {
    const [subject, setSubject] = useState('');
    const [ton, setTon] = useState(TONS[0]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!subject.trim()) {
            setError("Veuillez fournir un sujet et des instructions pour la rédaction.");
            setContent('');
            return;
        }

        setIsLoading(true);
        setError('');
        setContent('');

        try {
            // L'API attend "subject" et "ton"
            const response = await axios.post(`${apiUrl}/api/generate`, {
                subject: subject,
                ton: ton,
            });

            if (response.data.success) {
                // Le contenu généré est dans le champ 'content' de la réponse API
                setContent(response.data.content);
            }

        } catch (err) {
            console.error("Erreur lors de la génération:", err);
            // Extrait les détails de l'erreur (y compris l'erreur 400 ou 500 du back-end)
            const apiErrorMessage = err.response?.data?.detail || "Erreur de connexion ou traitement inconnu par l'API.";
            setError(`🚨 Échec de la génération : ${apiErrorMessage}`);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tab-content">
            
            <h3 className="text-primary">✍️ Générateur de Contenu Intelligent</h3>
            <Alert variant="info" className="status-info">
                Rédigez des textes professionnels, e-mails ou publications. Choisissez le ton souhaité pour un résultat parfait.
            </Alert>
            
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Formulaire de Sélection du Ton */}
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-dark">Choisissez le Ton de la Rédaction :</Form.Label>
                        <Form.Select 
                            value={ton} 
                            onChange={(e) => setTon(e.target.value)} 
                            className="form-control"
                            disabled={isLoading}
                        >
                            {TONS.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Zone de Saisie du Sujet */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-dark">Sujet et Instructions de Rédaction :</Form.Label>
                <Form.Control
                    as="textarea"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Rédigez une publication LinkedIn inspirante sur l'importance de l'IA dans l'éducation."
                    rows={8}
                    className="form-control"
                    disabled={isLoading}
                />
            </Form.Group>

            {/* Bouton de Génération */}
            <Button
                onClick={handleGenerate}
                disabled={isLoading}
                variant="primary"
                className="primary-button mb-4" // Applique le style sophistiqué de App.css
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
                        Génération en cours...
                    </>
                ) : (
                    'Générer le Contenu'
                )}
            </Button>

            {/* --- Zone de Résultat --- */}
            {content && (
                <div className="result-box mt-4">
                    <div className="text-primary mb-3 fw-bold">Contenu Généré (Ton : {ton}) :</div>
                    
                    {/* ✅ Affichage du Markdown avec ReactMarkdown */}
                    <ReactMarkdown>{content}</ReactMarkdown>
                    
                </div>
            )}
        </div>
    );
};

export default ContentGenerator;