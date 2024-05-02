import React, { useEffect, useState } from "react";
import api from "../../../api";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

export default function HistoricoRequisicao() {
    const [historico, setHistorico] = useState([]);
    const [maxRows, setMaxRows] = useState(10); // Defina o número máximo de linhas aqui

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const response = await api.get('/api/requisicao/user/history');
                setHistorico(response.data);
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
            }
        }

        fetchProdutos();
    }, []);

    const formatarData = (data) => {
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        const hora = String(dataObj.getHours()).padStart(2, '0');
        const minuto = String(dataObj.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
    };

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case 'Pendente':
                return '#d0cbcb'; // Cinza claro
            case 'Confirmado':
                return '#E0FEE0'; // Verde claro
            case 'Cancelado':
                return '#cb6868'; // Vermelho claro
            default:
                return '#FFFFFF'; // Branco
        }
    };

    return (
        <section style={{ backgroundColor: 'white', borderRadius: '10px', padding: '40px', marginTop: '90px', paddingTop: '40px', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ marginBottom: '20px' }}>Histórico Requisições</h1>
            <div style={{ width: '100%', margin: '0px auto' }}>
                <TableContainer>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Tipo</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Quantidade</TableCell>
                                <TableCell style={{ backgroundColor: '#d7cece', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Ultima Atualização</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historico.slice(0, maxRows).map((historico) => (
                                <TableRow key={historico.id}>
                                    <TableCell style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>{historico.tipo}</TableCell>
                                    <TableCell style={{ color: '#000', fontWeight: 'bold', textAlign: 'center', backgroundColor: getStatusBackgroundColor(historico.status) }}>{historico.status}</TableCell>
                                    <TableCell style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>{historico.quantidade}</TableCell>
                                    <TableCell style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}>{formatarData(historico.updatedAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {historico.length > maxRows && (
                <Button onClick={() => setMaxRows(maxRows + 10)}>Mostrar mais</Button>
            )}
        </section>
    );
}
