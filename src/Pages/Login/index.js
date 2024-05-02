import React, { useState } from 'react';
import './style.css';
import api from '../../api';
import { useAuth } from '../../hooks/context';
import { toast } from 'react-toastify'; // Importe o toast
import { Link } from 'react-router-dom'; // Importe o Link

export default function Login() {
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');
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
                    <input className='input-login' type="text" placeholder="Número do funcionário" value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} />
                    <input className='input-login' type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className='btn-primary' style={{ marginBottom: '50px' }} onClick={handleLogin}>Entrar</button>
                </div>
            </div>
        </div>
    );
}
