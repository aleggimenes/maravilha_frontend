import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from '../../../hooks/context';
import { toast } from 'react-toastify'; // Importe o toast

// Componente para o modal de confirmação de exclusão
function ConfirmationModal({ open, handleClose, handleConfirm }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                <h2 id="modal-title" style={{ marginBottom: '20px', marginTop: '20px' }}>Confirmação</h2>
                <p id="modal-description">Tem certeza que deseja excluir esta requisição?</p>
                <div style={{ marginTop: '20px', width: '50%', display: 'flex', flexDirection: 'row', gap: '35px', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button variant="contained" onClick={handleConfirm}>Sim</Button>
                    <Button variant="contained" onClick={handleClose}>Não</Button>
                </div>
            </div>
        </Modal>
    );
}

export default function ListRequisitor() {
    const [requisicoes, setRequisicoes] = useState([]);
    const [maxRows, setMaxRows] = useState(10);
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);
    const [requisitionId, setRequisitionId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingRequisition, setEditingRequisition] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [tipo, setTipo] = useState('');
    const [id_produto, setIdProduto] = useState('');
    const [quantidade, setQuantidade] = useState(0);

    const { user } = useAuth();

    async function fetchRequisicoes() {
        try {
            const response = await api.post(`api/requisicao/user/${user?.id}`);
            setRequisicoes(response?.data);
        } catch (error) {
            console.error('Erro ao buscar as requisições:', error);
        }
    }

    const handleGetAllProdutos = async () => {
        try {
            const response = await api.get('api/produtos');
            setProdutos(response.data);
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchRequisicoes();
        handleGetAllProdutos();
    }, [user]);

    const handleModalOpen = () => {
        setModalOpen(true);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const handleOpenEditModal = (requisicao) => {
        setEditingRequisition(requisicao);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingRequisition(null);
        setEditModalOpen(false);
    };

    const handleCadastrarRequisicao = async () => {
        try {
            const response = await api.post(`/api/requisicao`, {
                tipo: tipo,
                usuarioId: user?.id,
                id_produto: id_produto,
                quantidade: quantidade
            });
            toast.success('Requisição cadastrada com sucesso.');
            fetchRequisicoes();
            setModalOpen(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao cadastrar requisição. Por favor, tente novamente.');
            }
        }
    };

    const handleEditarRequisicao = async () => {
        try {
            const response = await api.put(`/api/requisicao/${editingRequisition.id}`, {
                tipo: editingRequisition.tipo,
                id_produto: editingRequisition.id_produto,
                quantidade: editingRequisition.quantidade
            });
            toast.success('Requisição editada com sucesso.');
            fetchRequisicoes();
            handleCloseEditModal();
        } catch (error) {
            console.error('Erro ao editar requisição:', error);
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage);
            } else {
                toast.error('Erro ao editar requisição. Por favor, tente novamente.');
            }
        }
    };

    const handleOpenDeleteConfirmationModal = (id) => {
        setOpenDeleteConfirmationModal(true);
        setRequisitionId(id);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setOpenDeleteConfirmationModal(false);
    };

    async function handleDeleteRequisition() {
        try {
            await api.delete(`api/requisicao/${requisitionId}`);
            fetchRequisicoes();
            handleCloseDeleteConfirmationModal();

        } catch (error) {
            console.error('Erro ao excluir a requisição:', error);
        }
    }

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
        <section style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px', marginTop: '90px', paddingTop: '40px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ marginBottom: '20px' }}>Listagem de Requisições</h1>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Button variant="contained" onClick={handleModalOpen}>Nova Requisição</Button>
            </div>

            <ConfirmationModal
                open={openDeleteConfirmationModal}
                handleClose={handleCloseDeleteConfirmationModal}
                handleConfirm={handleDeleteRequisition}
            />

            <div style={{ width: '100%', margin: '0px auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Tipo</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Quantidade</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Data da Requisição</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requisicoes.slice(0, maxRows).map((requisicao) => (
                                <TableRow key={requisicao.id}>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.tipo}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.status}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.quantidade}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{formatarData(requisicao.createdAt)}</TableCell>
                                    <TableCell style={{ textAlign: 'center', gap: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Button onClick={() => handleOpenDeleteConfirmationModal(requisicao?.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Cancelar</Button>
                                        <Button onClick={() => handleOpenEditModal(requisicao)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Editar</Button>
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
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Nova Requisição</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px', display: 'flex', flexDirection: 'column', width: '90%' }}>
                        <Select
                            fullWidth
                            id="tipo"
                            label="Tipo"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            variant="outlined"
                            margin="normal"
                        >
                            <MenuItem value="Compra">Compra</MenuItem>
                            <MenuItem value="Reserva">Reserva</MenuItem>
                        </Select>

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="produto-label">Produto</InputLabel>
                            <Select
                                labelId="produto-label"
                                id="produto"
                                value={id_produto}
                                onChange={(e) => setIdProduto(e.target.value)}
                                label="Produto"
                            >
                                {produtos.map((produto) => (
                                    <MenuItem key={produto.id} value={produto.id}>
                                        {produto.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            id="quantidade"
                            label="Quantidade"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', margin: '0px auto' }} onClick={() => handleCadastrarRequisicao()}>Cadastrar</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={editModalOpen} onClose={handleCloseEditModal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Editar Requisição</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px', display: 'flex', flexDirection: 'column', width: '90%' }}>
                        <Select
                            fullWidth
                            id="tipo"
                            label="Tipo"
                            value={editingRequisition?.tipo || ''}
                            onChange={(e) => setEditingRequisition({ ...editingRequisition, tipo: e.target.value })}
                            variant="outlined"
                            margin="normal"
                        >
                            <MenuItem value="Compra">Compra</MenuItem>
                            <MenuItem value="Reserva">Reserva</MenuItem>
                        </Select>

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel id="produto-label">Produto</InputLabel>
                            <Select
                                labelId="produto-label"
                                id="produto"
                                value={editingRequisition?.id_produto || ''}
                                onChange={(e) => setEditingRequisition({ ...editingRequisition, id_produto: e.target.value })}
                                label="Produto"
                            >
                                {produtos.map((produto) => (
                                    <MenuItem key={produto.id} value={produto.id}>
                                        {produto.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            id="quantidade"
                            label="Quantidade"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={editingRequisition?.quantidade || ''}
                            onChange={(e) => setEditingRequisition({ ...editingRequisition, quantidade: e.target.value })}
                        />
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', margin: '0px auto' }} onClick={() => handleEditarRequisicao()}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
