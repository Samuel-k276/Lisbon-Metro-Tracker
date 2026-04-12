import type { LineState } from '@/shared/types/metro';
import { apiFetch } from '@/shared/api/client';
import { logger } from '@/shared/utils/logger';

type LineStateApiResponse = {
  codigo: string;
  resposta: {
    amarela: string;
    tipo_msg_am: string;
    azul: string;
    tipo_msg_az: string;
    verde: string;
    tipo_msg_vd: string;
    vermelha: string;
    tipo_msg_vm: string;
  };
};

const fetchLineStateAll = async (): Promise<LineState[]> => {
  try {
    const response = await apiFetch('/estadoLinha/todos');
    const data: LineStateApiResponse = await response.json();

    if (data.codigo !== '200' || !data.resposta) {
      throw new Error('Invalid response format or no data received, code: ' + data.codigo);
    }

    const capitalize = (s: string) => s.trim().replace(/^\w/, (c) => c.toUpperCase());

    const lineStates: LineState[] = [
      {
        name: 'Amarela',
        status: capitalize(data.resposta.amarela),
        message: data.resposta.tipo_msg_am,
      },
      { name: 'Azul', status: capitalize(data.resposta.azul), message: data.resposta.tipo_msg_az },
      {
        name: 'Verde',
        status: capitalize(data.resposta.verde),
        message: data.resposta.tipo_msg_vd,
      },
      {
        name: 'Vermelha',
        status: capitalize(data.resposta.vermelha),
        message: data.resposta.tipo_msg_vm,
      },
    ];

    return lineStates;
  } catch (error) {
    logger.error('Error fetching line state:', error);
    return [];
  }
};

export { fetchLineStateAll };
export type { LineStateApiResponse };
