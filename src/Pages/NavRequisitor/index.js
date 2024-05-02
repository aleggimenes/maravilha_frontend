import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListRequisitor from './ListRequisitor';
import HistoricoRequisicaoUser from './HistoricoRequisicaoUser';

import { useAuth } from '../../hooks/context';
import './style.css'; // Estilo CSS para o layout lateral

export default function NavRequisitor() {
    const [mostrarRequisicoes, setMostrarRequisicoes] = useState(true);
    const { logout } = useAuth();

    const handleClickRequisicoes = () => {
        setMostrarRequisicoes(true);
    };

    const handleClickProdutos = () => {
        setMostrarRequisicoes(false);
    };

    return (
        <div className="nav-container">
            <nav className="nav-sidebar">
                <img src="./img/logo_new.png" style={{ width: '220px', height: '220px', resize: 'cover' }} />
                <button className="button-nav" style={{ color: mostrarRequisicoes === true ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickRequisicoes}>Listagem de Requisições</button>
                <button className="button-nav" style={{ marginBottom: '150px', color: mostrarRequisicoes === false ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickProdutos}>Histórico de Requisições</button>
                <button className="button-nav" onClick={logout}>Logout</button> {/* Aqui está a correção */}
            </nav>
            <div className="content">
                {mostrarRequisicoes === true ? <ListRequisitor /> : <HistoricoRequisicaoUser />}
            </div>
        </div>
    );
}
