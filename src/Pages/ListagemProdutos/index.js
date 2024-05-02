import React, { useEffect, useState } from "react";
import api from "../../api";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { useAuth } from "../../hooks/context";

import { toast } from 'react-toastify'; // Importe o toast

export default function ListagemProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [maxRows, setMaxRows] = useState(10); // Defina o número máximo de linhas aqui
    const [nome, setNome] = useState('');
    const [quantidadeTotal, setQuantidadeTotal] = useState(0)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [idProduto, setIdProduto] = useState()
    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);
    const { user } = useAuth();
    const handleOpenModal = () => {
        setModalOpen(true)
    }
    const handleOpenModalClose = () => {
        setModalOpen(false);
    };

    const handleOpenModalEdit = (id) => {
        setIdProduto(id)
        setModalOpenEdit(true)
    }
    const handleOpenModalCloseEdit = () => {
        setModalOpenEdit(false);
    };

    const handleCloseDeleteConfirmationModal = () => {
        setOpenDeleteConfirmationModal(false);
    };
    const handleOpenDeleteConfirmationModal = (id) => {
        setOpenDeleteConfirmationModal(true);
        setIdProduto(id);
    };
    const fetchProdutos = async () => {
        try {
            const response = await api.get('/api/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os produtos:', error);
        }
    }
    useEffect(() => {
        fetchProdutos();
    }, []);


    const handleCadastrarProduto = async () => {
        try {
            const response = await api.post(`/api/produtos`, {
                nome: nome,
                quantidadeTotal: quantidadeTotal,
            });
            // Se o cadastro for bem-sucedido, exibe uma mensagem de sucesso
            toast.success('Produto cadastrado com sucesso.');
            // Atualiza a listagem após o cadastro
            fetchProdutos();
            // Fecha o modal após o cadastro
            setModalOpen(false);
        } catch (error) {
            // Se ocorrer um erro, exibe a mensagem de erro retornada pelo backend
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

    const handleEditarProduto = async () => {
        try {
            const response = await api.put(`/api/produtos/${idProduto}/editar`, {
                nome: nome,
                quantidadeTotal: quantidadeTotal,
            });
            // Se o cadastro for bem-sucedido, exibe uma mensagem de sucesso
            toast.success('Produto cadastrado com sucesso.');
            // Atualiza a listagem após o cadastro
            fetchProdutos();
            // Fecha o modal após o cadastro
            setModalOpenEdit(false);
        } catch (error) {
            // Se ocorrer um erro, exibe a mensagem de erro retornada pelo backend
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

    async function handleDeleteProduto() {
        try {
            await api.delete(`api/produtos/${idProduto}`);
            fetchProdutos();
            handleCloseDeleteConfirmationModal();
        } catch (error) {
            console.error('Erro ao excluir a requisição:', error);
        }
    }


    return (
        <section section style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px', marginTop: '90px', paddingTop: '40px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ marginBottom: '20px' }}>Listagem de Produtos</h1>
            {user.userType === 1 &&
                <Button variant="contained" style={{ marginBottom: '20px', marginTop: '20px' }} onClick={handleOpenModal}>Novo Produto</Button>
            }
            <ConfirmationModal
                open={openDeleteConfirmationModal}
                handleClose={handleCloseDeleteConfirmationModal}
                handleConfirm={handleDeleteProduto}
            />
            <div style={{ width: '100%', margin: '0px auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Nome</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Quantidade Total</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Quantidade Reservada</TableCell>
                                {user?.userType === 1 && (
                                    <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.slice(0, maxRows).map((produto) => (
                                <TableRow key={produto.id}>
                                    <TableCell style={{ textAlign: 'center' }}>{produto.nome}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{produto.quantidadeTotal}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{produto.quantidadeReservada}</TableCell>
                                    {user?.userType === 1 && (
                                        <TableCell style={{ textAlign: 'center', gap: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Button onClick={() => handleOpenModalEdit(produto?.id)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Editar</Button>
                                            <Button onClick={() => handleOpenDeleteConfirmationModal(produto?.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Apagar</Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {
                produtos.length > maxRows && (
                    <Button onClick={() => setMaxRows(maxRows + 10)}>Mostrar mais</Button>
                )
            }

            <Modal open={modalOpen} onClose={handleOpenModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Novo Produto</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px', display: 'flex', flexDirection: 'column', width: '90%' }}>
                        <TextField
                            fullWidth
                            id="nome"
                            label="Nome"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="quantidadeEstoque"
                            label="Quantidade no Estoque"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={quantidadeTotal}
                            onChange={(e) => setQuantidadeTotal(e.target.value)}
                        />
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', margin: '0px auto' }} onClick={() => handleCadastrarProduto()}>Cadastrar</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={modalOpenEdit} onClose={handleOpenModalCloseEdit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Editar Produto</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px', display: 'flex', flexDirection: 'column', width: '90%' }}>
                        <TextField
                            fullWidth
                            id="nome"
                            label="Nome"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="quantidadeEstoque"
                            label="Quantidade no Estoque"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={quantidadeTotal}
                            onChange={(e) => setQuantidadeTotal(e.target.value)}
                        />
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', margin: '0px auto' }} onClick={() => handleEditarProduto()}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </section >
    )
}
