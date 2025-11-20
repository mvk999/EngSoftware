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
  { id: '#1', name: 'Eletronicos' },
  { id: '#2', name: 'Periféricos' },
  { id: '#3', name: 'Fones' },
  { id: '#4', name: 'Notebooks' },
  { id: '#5', name: 'Eletronicos' },
  { id: '#6', name: 'Periféricos' },
  { id: '#7', name: 'Fones' },
  { id: '#8', name: 'Notebooks' },
  { id: '#9', name: 'Eletronicos' },
  { id: '#10', name: 'Periféricos' },
  { id: '#11', name: 'Fones' },
  { id: '#12', name: 'Notebooks' },
];

const columns = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'name', label: 'NOME', minWidth: 300, flex: 1 },
  { id: 'actions', label: 'AÇÕES', minWidth: 150, align: 'right' },
];

function CategoryTable({ onEditarCategoria }) {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  return (
    <Box sx={{ p: 3, backgroundColor: '#15141B', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Paper 
        sx={{ 
          width: '733px',
          backgroundColor: '#191922',
          borderRadius: '8px',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          border: 'none',
        }}
      >
        {/* Título */}
        <Box sx={{ 
          backgroundColor: '#191922', 
          p: 2.5,
          borderBottom: 'none',
        }}>
          <Typography 
            sx={{ 
              color: '#C4CDD5',
              fontWeight: '500',
              fontSize: '20px',
              lineHeight: '150%',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Gerenciamento de Categorias
          </Typography>
        </Box>

        {/* Cabeçalho da Tabela */}
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
                      padding: '16px 20px',
                      border: 'none',
                      fontFamily: 'Poppins',
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
                    borderBottom: index < currentRows.length - 1 ? '1px solid #2a2f3f' : 'none',
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
                          padding: '16px 20px',
                          fontSize: '14px',
                          lineHeight: '150%',
                          border: 'none',
                          fontFamily: 'Poppins',
                          fontWeight: '400',
                        }}
                      >
                        {column.id === 'actions' ? (
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                            <button 
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0',
                                color: '#FFC831',
                                transition: 'opacity 0.2s',
                              }}
                              title="Editar"
                              onClick={() => onEditarCategoria && onEditarCategoria(row)}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
                                padding: '0',
                                color: '#FFC831',
                                transition: 'opacity 0.2s',
                              }}
                              title="Deletar"
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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

export default CategoryTable;