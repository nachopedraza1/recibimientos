import { FC } from 'react';
import { SectionLayout } from '../layouts';
import { Button, Grid, Typography } from '@mui/material';
import { navigateWithoutHash } from '@/utils/navigateWithoutHash';

export const SectionHome: FC = () => {
    return (
        <SectionLayout idSection='inicio'>
            <Grid container justifyContent="center" alignItems="center" minHeight="100vh" >
                <Grid item xs={12} textAlign="center">

                    <Typography variant="h3" color="white" data-aos="fade-down">
                        Página oficial de recibimientos CAB
                    </Typography>

                    <Typography variant="h6" color="white" data-aos="fade-in" data-aos-delay="600">
                        Con tu aporte hacemos los recibimientos
                        <Typography variant='h6' component='span' color='primary.main' mx={1} fontWeight='bold'>
                            MAS GRANDES
                        </Typography>
                        del pais.
                    </Typography>

                    <Button
                        data-aos="fade-up" data-aos-delay="800"
                        variant='contained'
                        size='large'
                        sx={{ mt: 1 }}
                        onClick={(e) => navigateWithoutHash(e, 'ingresos')}
                    >
                        Realiza tu aporte ahora
                    </Button>

                </Grid>
            </Grid>
            <div className='bg-fixed'></div>
        </SectionLayout>
    )
}
