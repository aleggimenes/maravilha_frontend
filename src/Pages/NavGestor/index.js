import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListagemRequisicao from './ListagemRequisicao';
import ListagemProdutos from '../ListagemProdutos';
import ListagemUsersRequisitantes from './ListagemUsersRequisitantes';
import HistoricoRequisicao from './HistoricoRequisicao';
import { useAuth } from '../../hooks/context';
import './style.css'; // Estilo CSS para o layout lateral

export default function NavGestor() {
    const [mostrarRequisicoes, setMostrarRequisicoes] = useState(0);
    const { logout } = useAuth();

    const handleClickRequisicoes = () => {
        setMostrarRequisicoes(0);
    };

    const handleClickProdutos = () => {
        setMostrarRequisicoes(1);
    };
    const handleClickUsers = () => {
        setMostrarRequisicoes(2);
    };
    const handleClickHistorico = () => {
        setMostrarRequisicoes(3);
    };


    return (
        <div className="nav-container">
            <nav className="nav-sidebar">
                <img src="./img/logo_new.png" style={{ width: '220px', height: '220px', resize: 'cover' }} />
                <button className="button-nav" style={{ color: mostrarRequisicoes === 0 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickRequisicoes}>Listagem de Requisições</button>
                <button className="button-nav" style={{ color: mostrarRequisicoes === 1 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickProdutos}>Listagem de Produtos</button>
                <button className="button-nav" style={{ color: mostrarRequisicoes === 2 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s' }} onClick={handleClickUsers}>Listagem de Usuarios Requisitantes</button>
                <button className="button-nav" style={{ color: mostrarRequisicoes === 3 ? '#42A5F5' : '#9EA8B6', transition: 'color 0.5s', marginBottom:'90px' }} onClick={handleClickHistorico}>Histórico Requisições</button>


                <button className="button-nav" onClick={logout}>Logout</button> {/* Aqui está a correção */}
            </nav>
            <div className="content">
                {mostrarRequisicoes === 0 ? <ListagemRequisicao /> : mostrarRequisicoes === 1 ? <ListagemProdutos /> : mostrarRequisicoes === 2 ? <ListagemUsersRequisitantes /> : <HistoricoRequisicao />}
            </div>
        </div>
    );
}
