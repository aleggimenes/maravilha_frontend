import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Button } from "@mui/material";
import { toast } from 'react-toastify'; // Importe o toast

export default function ListagemRequisicao() {
    const [requisicoes, setRequisicoes] = useState([]);
    const [selectedRequisicao, setSelectedRequisicao] = useState(null);
    const [pin, setPin] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [maxRows, setMaxRows] = useState(10); // Defina o número máximo de linhas aqui

    const fetchRequisicoes = async () => {
        try {
            const response = await api.get('/api/requisicao');
            setRequisicoes(response.data);
        } catch (error) {
            console.error('Erro ao buscar as requisições:', error);
        }
    };

    useEffect(() => {
        fetchRequisicoes();
    }, []);

    const handleConfirmarCancelamento = (requisicao) => {
        setSelectedRequisicao(requisicao);
        setModalOpen(true);
    };

    const handleConfirmar = async (status) => {
        try {
            const response = await api.put(`/api/requisicao/${selectedRequisicao.id}/confirmar`, {
                pin,
                status: newStatus
            });
            fetchRequisicoes(); // Atualizar a listagem após confirmar ou cancelar
            setModalOpen(false); // Fechar o modal após a confirmação
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage);
            } else {
                // Se a resposta de erro não contiver uma mensagem personalizada, exibe uma mensagem genérica
                toast.error('Erro ao cadastrar usuário. Por favor, tente novamente.');
            }
            // Se desejar, você também pode logar o erro no console para fins de depuração
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setPin(''); // Limpar o campo de texto do pin
    };

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        const hora = String(dataObj.getHours()).padStart(2, '0');
        const minuto = String(dataObj.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
    };

    return (
        <section section style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px', marginTop: '90px', paddingTop: '40px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ marginBottom: '20px' }}>Listagem de Requisição</h1>
            <div style={{ width: '100%', margin: '0px auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Tipo</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Nome Requisitor</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Quantidade Pedida</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Nome Produto</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Data da Requisição</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Pin</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requisicoes.slice(0, maxRows).map((requisicao) => (
                                <TableRow key={requisicao.id}>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.tipo}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.nomeUsuario}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }} >{requisicao.quantidade}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }} >{requisicao.nomeProduto}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{formatarData(requisicao.createdAt)}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.pin}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.status}</TableCell>
                                    <TableCell style={{ textAlign: 'center', gap: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {requisicao.status === 'Pendente' && (
                                            <>
                                                <Button onClick={() => handleConfirmarCancelamento(requisicao, setNewStatus('Cancelado'))} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Cancelar</Button>
                                                <Button onClick={() => handleConfirmarCancelamento(requisicao, setNewStatus('Confirmado'))} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Confirmar</Button>
                                            </>
                                        )}
                                        {requisicao.status === 'Cancelado' && (
                                            <Button onClick={() => handleConfirmarCancelamento(requisicao, setNewStatus('Confirmado'))} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Confirmar</Button>
                                        )}
                                        {requisicao.status === 'Confirmado' && (
                                            <Button onClick={() => handleConfirmarCancelamento(requisicao, setNewStatus('Cancelado'))} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Cancelar</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {requisicoes.length > maxRows && (
                <Button onClick={() => setMaxRows(maxRows + 10)}>Mostrar mais</Button>
            )}

            <Modal open={modalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '20%', padding: '20px', borderRadius: '8px' }}>
                    <TextField
                        label="PIN"
                        type="password"
                        value={pin}
                        style={{ width: '90%', margin: '0px auto' }}
                        onChange={(e) => setPin(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Button onClick={() => handleConfirmar('Confirmado')}>Sim</Button>
                        <Button onClick={handleModalClose}>Não</Button>
                    </div>
                </div>
            </Modal>
        </section >
    );
}
