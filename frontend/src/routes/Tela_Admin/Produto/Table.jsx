// routes/Tela_Admin/Table.jsx
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'idcategoria', label: 'ID-CATEGORIA', minWidth: 110 },
  { id: 'name', label: 'NOME', minWidth: 200 },
  { id: 'descricao', label: 'DESCRIÇÃO', minWidth: 260 },
  { id: 'preco', label: 'PREÇO', minWidth: 100, align: 'right' },
  { id: 'estoque', label: 'ESTOQUE', minWidth: 100, align: 'right' },
  { id: 'actions', label: 'AÇÕES', minWidth: 120, align: 'right' },
];

function ProdutoTable({
  produtos = [],
  onEditarCategoria,
  onDeleteProduto,
}) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = produtos.slice(startIndex, endIndex);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#15141B',
        minHeight: '100vh',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '1100px',
          backgroundColor: '#191922',
          borderRadius: '8px',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          border: 'none',
        }}
      >
        {/* Título */}
        <Box
          sx={{
            backgroundColor: '#191922',
            p: 2.5,
            borderBottom: 'none',
          }}
        >
          <Typography
            sx={{
              color: '#C4CDD5',
              fontWeight: '500',
              fontSize: '20px',
              lineHeight: '150%',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Gerenciamento de Produtos
          </Typography>
        </Box>

        {/* Tabela */}
        <TableContainer sx={{ maxHeight: 'auto' }}>
          <Table aria-label="tabela de produtos">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#D9D9D9' }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      minWidth: column.minWidth,
                      color: '#4D4D4D',
                      fontWeight: '500',
                      fontSize: '12px',
                      lineHeight: '100%',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      padding: '12px 16px',
                      border: 'none',
                      fontFamily: 'Poppins',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor: '#191922',
                    borderBottom:
                      index < currentRows.length - 1
                        ? '1px solid #2a2f3f'
                        : 'none',
                    '&:hover': {
                      backgroundColor: '#1f2430',
                    },
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];

                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{
                          color: '#C4CDD5',
                          padding: '12px 16px',
                          fontSize: '14px',
                          lineHeight: '150%',
                          border: 'none',
                          fontFamily: 'Poppins',
                          fontWeight: '400',
                          maxWidth:
                            column.id === 'descricao' ? '320px' : 'none',
                          whiteSpace:
                            column.id === 'descricao' ? 'normal' : 'nowrap',
                          wordBreak:
                            column.id === 'descricao' ? 'break-word' : 'normal',
                        }}
                      >
                        {column.id === 'actions' ? (
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}
                          >
                            {/* EDITAR */}
                            <button
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                color: '#FFC831',
                                transition: 'opacity 0.2s',
                              }}
                              title="Editar"
                              onClick={() =>
                                onEditarCategoria && onEditarCategoria(row)
                              }
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = '0.7')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = '1')
                              }
                            >
                              <EditIcon sx={{ width: 20, height: 20 }} />
                            </button>

                            {/* DELETAR */}
                            <button
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                color: '#FFC831',
                                transition: 'opacity 0.2s',
                              }}
                              title="Deletar"
                              onClick={() =>
                                onDeleteProduto && onDeleteProduto(row.id)
                              }
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = '0.7')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = '1')
                              }
                            >
                              <DeleteIcon sx={{ width: 20, height: 20 }} />
                            </button>
                          </Box>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginação */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1.5,
            p: 2.5,
            borderTop: '1px solid #2a2f3f',
            backgroundColor: '#191922',
          }}
        >
          <Pagination
            count={Math.ceil(produtos.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            size="large"
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default ProdutoTable;
