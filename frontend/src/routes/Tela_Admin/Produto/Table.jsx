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

const rows = [
  {
    id: '#1',
    idcategoria: '#C1',
    name: 'Mouse Gamer RGB',
    descricao: 'Mouse óptico 7200 DPI com iluminação RGB',
    preco: 'R$ 129,90',
    estoque: 37,
  },
  {
    id: '#2',
    idcategoria: '#C1',
    name: 'Teclado Mecânico',
    descricao: 'Teclado mecânico ABNT2 com switches blue',
    preco: 'R$ 349,90',
    estoque: 18,
  },
  {
    id: '#3',
    idcategoria: '#C2',
    name: 'Headset 7.1 Surround',
    descricao: 'Headset gamer com som surround virtual 7.1',
    preco: 'R$ 279,90',
    estoque: 25,
  },
  {
    id: '#4',
    idcategoria: '#C3',
    name: 'Notebook UltraSlim 14"',
    descricao: 'Notebook 14" i5, 8GB RAM, SSD 256GB',
    preco: 'R$ 3.499,00',
    estoque: 9,
  },
  {
    id: '#5',
    idcategoria: '#C1',
    name: 'Monitor 24" Full HD',
    descricao: 'Monitor 24" 75Hz com bordas finas',
    preco: 'R$ 899,90',
    estoque: 12,
  },
  {
    id: '#6',
    idcategoria: '#C2',
    name: 'Webcam Full HD',
    descricao: 'Webcam 1080p com microfone embutido',
    preco: 'R$ 199,90',
    estoque: 40,
  },
  {
    id: '#7',
    idcategoria: '#C2',
    name: 'Mousepad Extended',
    descricao: 'Mousepad estendido 90x30cm com base emborrachada',
    preco: 'R$ 79,90',
    estoque: 52,
  },
  {
    id: '#8',
    idcategoria: '#C3',
    name: 'Notebook Gamer 15,6"',
    descricao: 'Notebook Ryzen 7, 16GB RAM, RTX 3060',
    preco: 'R$ 7.999,00',
    estoque: 4,
  },
  {
    id: '#9',
    idcategoria: '#C4',
    name: 'SSD NVMe 1TB',
    descricao: 'SSD NVMe PCIe 3.0 1TB até 3500MB/s',
    preco: 'R$ 529,90',
    estoque: 30,
  },
  {
    id: '#10',
    idcategoria: '#C4',
    name: 'HD 2TB 3.5"',
    descricao: 'HD interno 2TB para desktop, 7200RPM',
    preco: 'R$ 399,90',
    estoque: 21,
  },
  {
    id: '#11',
    idcategoria: '#C5',
    name: 'Fonte 650W 80 Plus Bronze',
    descricao: 'Fonte ATX 650W com certificação 80 Plus Bronze',
    preco: 'R$ 449,90',
    estoque: 14,
  },
  {
    id: '#12',
    idcategoria: '#C5',
    name: 'Gabinete Mid Tower RGB',
    descricao: 'Gabinete com lateral em vidro temperado e 3 fans RGB',
    preco: 'R$ 499,90',
    estoque: 11,
  },
];


const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'idcategoria', label: 'ID-CATEGORIA', minWidth: 110 },
  { id: 'name', label: 'NOME', minWidth: 200 },
  { id: 'descricao', label: 'DESCRIÇÃO', minWidth: 260 },
  { id: 'preco', label: 'PREÇO', minWidth: 100, align: 'right' },
  { id: 'estoque', label: 'ESTOQUE', minWidth: 100, align: 'right' },
  { id: 'actions', label: 'AÇÕES', minWidth: 120, align: 'right' },
];

function ProdutoTable({ onEditarCategoria }) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

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
          <Table aria-label="tabela de categorias">
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
            count={Math.ceil(rows.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#C4CDD5',
                borderColor: '#3a3f4f',
                fontFamily: 'Poppins',
                fontWeight: '500',
                fontSize: '16px',
                width: '36px',
                height: '36px',
                backgroundColor: '#191922',
                border: '1px solid #E6E6E6',
                borderRadius: '50%',
                '&.Mui-selected': {
                  backgroundColor: '#FFC831',
                  color: '#191922',
                  border: 'none',
                  fontWeight: '500',
                  '&:hover': {
                    backgroundColor: '#FFD54F',
                  },
                },
                '&:hover': {
                  backgroundColor: '#2a2f3f',
                  borderColor: '#3a3f4f',
                },
              },
              '& .MuiButtonBase-root': {
                margin: '0 6px',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default ProdutoTable;
