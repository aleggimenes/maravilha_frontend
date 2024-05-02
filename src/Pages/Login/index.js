import React, { useState } from 'react';
import './style.css';
import api from '../../api';
import { useAuth } from '../../hooks/context';
import { toast } from 'react-toastify'; // Importe o toast
import { Link } from 'react-router-dom'; // Importe o Link
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Importe o IconButton e InputAdornment do Material-UI
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Importe os ícones de visibilidade do Material-UI

export default function Login() {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
    const { login } = useAuth(); // Obtenha a função login do contexto

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/login', {
                employeeNumber: employeeNumber,
                password: password
            });

            const { token, user } = response.data;
            login(user, token); // Chame a função login do contexto com os dados do usuário e o token
        } catch (error) {
            // Exiba uma notificação de erro usando toast
            toast.error('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className='section-login'>
            <div className='container-login'>
                <div className='container-img'>
                    <img src='./img/new_login.jpg' style={{ width: '100%', height: '100%', resize: 'cover' }} />
                </div>
                <div className='container-inputs'>
                    <img src='./img/logo_frejen.png' style={{ width: '50px', height: '50px', resize: 'cover', marginBottom: '50px' }} />
                    <TextField
                        className='input-login'
                        placeholder="Número do funcionário"
                        value={employeeNumber}
                        onChange={(e) => setEmployeeNumber(e.target.value)}
                    />
                    <TextField
                        className='input-login'
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <button className='btn-primary' style={{ marginTop: '50px' }} onClick={handleLogin}>Entrar</button>
                </div>
            </div>
        </div>
    );
}
