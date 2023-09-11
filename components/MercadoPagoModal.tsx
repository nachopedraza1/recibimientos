import { FC, useContext } from 'react';
import Image from 'next/image';

import { UiContext } from '@/context/ui';
import { usePayment } from '@/hooks';

import { Box, Button, Typography } from "@mui/material";
import { ModalLayout } from '@/components/layouts';


const values = [250, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000];

export const MercadoPagoModal: FC = () => {

    const { modalStatus } = useContext(UiContext);

    const { selected, mercadoPagoPayment, urlPayment, isLoading, isAuthenticated } = usePayment();

    return (
        <ModalLayout modalType='mercadopago' modalStatus={modalStatus.mercadopago!}>

            <Typography variant="h4" fontWeight={600} textAlign="center">
                Mercado Pago
            </Typography>

            <span className='mini-divider' />

            <Typography>
                Por favor, selecciona uno de la lista:
            </Typography>

            <Box height='250px' paddingRight={2} display='flex' flexDirection='column' gap={1.5} sx={{ overflowX: 'hidden', overflowY: 'scroll' }}>
                {
                    values.map((amount) => (
                        <Box
                            key={amount}
                            className={amount === selected ? 'donate-box selected' : 'donate-box'}
                            onClick={() => mercadoPagoPayment(amount)}
                        >
                            <Typography> Aporte de ${amount} </Typography>
                            <Image width={45} height={45} src='/logo.png' alt='Recibimientos Cab Mercado Pago' />
                        </Box>
                    ))
                }
            </Box>

            <Typography>
                Seras redireccionado a Mercado Pago para completar tu aporte.
            </Typography>

            <Button
                variant='contained'
                disabled={!selected || isLoading || !isAuthenticated}
                href={urlPayment}
                className='checkout-mp'
                startIcon={<Image width={50} height={50} src='/mercadopago-short.png' alt='Recibimientos Cab MercadoPago' />}>
                Pagar con MercadoPago
            </Button>

        </ModalLayout>
    );
}