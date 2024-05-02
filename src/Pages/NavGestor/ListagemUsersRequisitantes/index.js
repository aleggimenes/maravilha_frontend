import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { toast } from 'react-toastify'; // Importe o toast
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Importe os ícones de visibilidade

export default function ListagemUsersRequisitantes() {
    const [user_requisicao, setUserRequisicoes] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [maxRows, setMaxRows] = useState(10); // Defina o número máximo de linhas aqui
    const [userId, setUserId] = useState();
    const [name, setName] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState(0);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

    const [modalNew, setModalNew] = useState(false);

    const fetchRequisicoes = async () => {
        try {
            const response = await api.get('/api/usersReq');
            setUserRequisicoes(response.data);
        } catch (error) {
            console.error('Erro ao buscar as requisições:', error);
        }
    };
    useEffect(() => {
        fetchRequisicoes();
    }, []);
    const handleOpenModalDelete = (userId) => {
        setUserId(userId);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleOpenModalNewUser = () => {
        setModalNew(true)
    }
    const handleOpenModalNewUserClose = () => {
        setModalNew(false);
    };

    const handleDeleteUser = async () => {
        try {
            const response = await api.delete(`/api/user/${userId}`);
            fetchRequisicoes(); // Atualizar a listagem após confirmar ou cancelar
            setModalOpen(false); // Fechar o modal após a confirmação
            toast.success('Usuário Deletado.');

        } catch (error) {
            console.error('Erro ao confirmar/cancelar requisição:', error);
        }
    }

    const handleCadastrarUser = async () => {
        try {
            const response = await api.post(`/api/users`, {
                name: name,
                employeeNumber: employeeNumber,
                password: password,
                userType: 2
            });
            // Se o cadastro for bem-sucedido, exibe uma mensagem de sucesso
            toast.success('Usuário cadastrado com sucesso.');
            // Atualiza a listagem após o cadastro
            fetchRequisicoes();
            // Fecha o modal após o cadastro
            setModalNew(false);
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

    return (
        <section section style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px', marginTop: '90px', paddingTop: '40px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ marginBottom: '20px' }}>Listagem de Usuários</h1>
            <Button variant="contained" style={{ marginBottom: '20px', marginTop: '20px' }} onClick={handleOpenModalNewUser}>Novo Requisitor</Button>

            <div style={{ width: '100%', margin: '0px auto' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Nome</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Número do Requisitor</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Requisições Pendentes</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user_requisicao.slice(0, maxRows).map((requisicao) => (
                                <TableRow key={requisicao.id}>
                                    <TableCell style={{ textAlign: 'center' }}>{requisicao.name}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }} >{requisicao.employeeNumber}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }} >{requisicao.pendingRequestsCount}</TableCell>

                                    <TableCell style={{ textAlign: 'center', gap: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Button onClick={() => handleOpenModalDelete(requisicao?.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>Apagar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {user_requisicao.length > maxRows && (
                <Button onClick={() => setMaxRows(maxRows + 10)}>Mostrar mais</Button>
            )}

            <Modal open={modalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Tem certeza ?</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px' }}>
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px' }} onClick={() => handleDeleteUser()}>Sim</Button>
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px' }} onClick={handleModalClose}>Não</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={modalNew} onClose={handleOpenModalNewUserClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '40%', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <h1>Novo Requisitor</h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '30px', display: 'flex', flexDirection: 'column', width: '90%' }}>
                        <TextField
                            fullWidth
                            id="quantidade"
                            label="Nome"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="employeeNumber"
                            label="Número do Usuario"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            margin="normal"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="password"
                            label="Senha do Usuario"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            type={showPassword ? "text" : "password"} // Altera o tipo do campo com base no estado
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                // Adiciona o ícone ao lado do campo de senha
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button className='btn-primary' style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', margin: '0px auto' }} onClick={() => handleCadastrarUser()}>Cadastrar</Button>
                    </div>
                </div>
            </Modal>


        </section >
    );
}
