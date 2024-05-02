import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListRequisitor from './ListRequisitor';
import HistoricoRequisicaoUser from './HistoricoRequisicaoUser';
import { useAuth } from '../../hooks/context';
import './style.css'; // Estilo CSS para o layout lateral
import ListagemProdutos from '../ListagemProdutos';
export default function NavRequisitor() {
    const [mostrarRequisicoes, setMostrarRequisicoes] = useState(0);
    const { logout } = useAuth();

    const handleClickRequisicoes = () => {
        setMostrarRequisicoes(0);
    };

    const handleClickHistorico = () => {
        setMostrarRequisicoes(1);
    };

    const handleClickListagemProdutos = () => {
        setMostrarRequisicoes(2);
    };

    return (
        <div className="nav-container">
            <nav className="nav-sidebar">
                <img src="./img/logo_new.png" style={{ width: '220px', height: '220px', resize: 'cover' }} />
                <button className="button-nav" style={{ color: mostrarRequisicoes === 0 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickRequisicoes}>Listagem de Requisições</button>
                <button className="button-nav" style={{ color: mostrarRequisicoes === 1 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickHistorico}>Históricode Requisições</button>
                <button className="button-nav" style={{ marginBottom: '150px', color: mostrarRequisicoes === 2 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickListagemProdutos}>Listagem de Produtos</button>
                <button className="button-nav" onClick={logout}>Logout</button> {/* Aqui está a correção */}
            </nav>
            <div className="content">
                {mostrarRequisicoes === 0 ? <ListRequisitor /> : mostrarRequisicoes === 1 ? <HistoricoRequisicaoUser /> : <ListagemProdutos />}
            </div>
        </div>
    );
}
