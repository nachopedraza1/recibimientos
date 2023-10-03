import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database';
import { Entry, Match } from '@/models';
import { format } from '@/utils';

import { IMatch, PaginationData } from '@/interfaces'

type Data =
    | { message: string }
    | PaginationData

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getMatches(req, res);

        case 'POST':
            return createMatch(req, res);

        case 'PUT':
            return updateMatch(req, res);

        default:
            return res.status(400).json({ message: 'Method not allowed.' })
    }

}

const getMatches = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const page = parseInt(req.query.page as string) || 1;
    const perPage = 10;

    try {
        await db.connect();

        const [
            rows,
            totalRows,
        ] = await Promise.all([
            Match.find()
                .sort({ createdAt: -1 })
                .select('name active objectiveAmount dateEvent')
                .skip((page - 1) * perPage)
                .limit(perPage)
                .lean(),
            Match.find().count(),
        ]);

        /* await db.disconnect(); */

        const formatRows = async () => {
            const promises = rows.map(async (row) => {

                const totalDonated = await Entry.aggregate([
                    {
                        $match: { category: row.name }
                    }, {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }]);

                return {
                    ...row,
                    totalDonated: `$${totalDonated[0] ? format(totalDonated[0].total) : '0'}`,
                    objectiveAmount: `$${format(row.objectiveAmount)}`
                };
            });

            const formattedRows = await Promise.all(promises);

            return formattedRows;
        };

        const resp = await formatRows();


        return res.status(200).json({
            rows: resp,
            totalRows,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar logs del servidor.' })
    }
}


const createMatch = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { dateEvent, name, objectiveAmount }: IMatch = req.body;

    if (!dateEvent) return res.status(400).json({ message: 'La fecha es requerida.' });
    if (!name) return res.status(400).json({ message: 'El título es requerido.' })
    if (!objectiveAmount) return res.status(400).json({ message: 'El objetivo es requerido.' });

    try {
        await db.connect();

        const exist = await Match.findOne({ name });
        if (exist) return res.status(400).json({ message: 'Este recibimiento ya existe.' });

        const newMatch = new Match({
            name,
            dateEvent,
            objectiveAmount,
            active: false,
        })

        await newMatch.save();

        return res.status(200).json({ message: 'Recibimiento creado con éxito.' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar logs del servidor.' });
    }

}

const updateMatch = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { matchName } = req.body;

    if (!matchName) return res.status(400).json({ message: 'Algo salio mal.' });

    await db.connect();

    try {

        const match = await Match.findOne({ name: matchName });

        if (!match) return res.status(400).json({ message: 'No existe un recibimiento.' });

        /* if (match.active) return res.status(400).json({ message: 'Ya existe un recibimiento activo.' }); */

        await Match.findOneAndUpdate({ name: matchName }, { active: !match.active });

        return res.status(200).json({ message: 'Recibimiento actualizado.' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar logs del servidor.' });
    }
}