import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Box,
  Button,
  CircularProgress,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import type { User } from '../../../types/appointment';

interface EmployeeSelectionModalProps {
  open: boolean;
  employees: User[];
  onClose: () => void;
  onSelect: (employeeId: number) => void;
  isLoading?: boolean;
  title?: string;
}

const EmployeeSelectionModal: React.FC<EmployeeSelectionModalProps> = ({
  open,
  employees,
  onClose,
  onSelect,
  isLoading = false,
  title = 'Select Employee',
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return employees.filter((e) => {
      const fullName = (e.fullName || '').toLowerCase();
      const email = (e.email || '').toLowerCase();
      return fullName.includes(search) || email.includes(search);
    });
  }, [employees, searchTerm]);

  const handleConfirm = () => {
    if (selectedEmployeeId) onSelect(selectedEmployeeId);
  };

  const renderList = () => {
    if (isLoading) {
      return (
        <Box py={6} display="flex" alignItems="center" justifyContent="center">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={32} />
            <Typography variant="body2">
              Loading employees...
            </Typography>
          </Stack>
        </Box>
      );
    }

    if (filteredEmployees.length === 0) {
      return (
        <Box py={6} textAlign="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5a4.5 4.5 0 014.5 4.5m3 10.5H4.5v-.75a6 6 0 0112 0V20zM12 11a4.5 4.5 0 01-4.5-4.5"
              />
            </svg>
          </Box>
          <Typography variant="body2">
            {searchTerm ? 'No employees found' : 'No employees available'}
          </Typography>
        </Box>
      );
    }

    return (
      <List
        dense
        disablePadding
        sx={{
          maxHeight: 360,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 3,
          },
        }}
      >
        {filteredEmployees.map((emp) => {
          const selected = emp.id === selectedEmployeeId;
          return (
            <ListItemButton
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              selected={selected}
              sx={{
                mb: 1,
                border: '1px solid',
                borderColor: selected ? 'var(--color-primary)' : 'var(--color-border-primary)',
                borderRadius: 2,
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.01)' },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: selected ? '#fff' : 'var(--color-text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {emp.fullName?.charAt(0)?.toUpperCase() || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  sx: { fontWeight: 600 },
                  noWrap: true,
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  noWrap: true,
                }}
                primary={emp.fullName || 'Unknown Employee'}
                secondary={emp.email || 'No email'}
              />
              {emp.role && (
                <Chip
                  size="small"
                  label={
                    typeof emp.role === 'string'
                      ? emp.role
                      : emp.role.name || 'Employee'
                  }
                  sx={{
                    mr: 1,
                    fontWeight: 500,
                  }}
                />
              )}
              {selected && (
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 16 }} />
                </Box>
              )}
            </ListItemButton>
          );
        })}
      </List>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      
    >
      <DialogTitle
        sx={{
          pr: 6,
          fontWeight: 700,
          borderBottom: '1px solid var(--color-border-primary)',
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
            size="small"
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
            }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ fontSize: 20 }}
                  />
                </InputAdornment>
              ),
            }}
           
          />
          <Divider />
          {renderList()}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid var(--color-border-primary)',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedEmployeeId}
          variant="contained"
          sx={{
            textTransform: 'none',
            minWidth: 180,
          }}
        >
          Confirm Allocation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeSelectionModal;