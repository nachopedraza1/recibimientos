import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';
import { Entry, Match } from '@/models';
import { format } from '@/utils';

import { PaginationData } from '@/interfaces';

type Data =
    | { message: string }
    | PaginationData

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    let { query = '', page = 1 } = req.query;
    const perPage = 10;

    if (query.length === 0) return res.status(400).json({ message: 'No se especifico el query de búsqueda.' });

    query = query.toString().toLowerCase();

    try {

        await db.connect();

        const activeMatch = await Match.findOne({ active: true });

        if (!activeMatch) return res.status(400).json({ message: 'No hay recibimientos activos.' })

        const [
            rows,
            totalRows,
            totalAmount,
        ] = await Promise.all([
            Entry.find({
                $text: { $search: query },
                category: activeMatch.name,
                name: { $ne: 'administrador' }
            })
                .sort({ createdAt: -1 })
                .select('name amount createdAt method status _id')
                .skip((Number(page) - 1) * perPage)
                .limit(perPage)
                .lean(),
            Entry.find({ $text: { $search: query }, category: activeMatch.name }).count(),
            Entry.aggregate([
                {
                    $match: { category: activeMatch.name }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ])
        ]);

        const formatRows = rows.map(row => {
            return {
                ...row,
                createdAt: JSON.stringify(row.createdAt).slice(1, 11),
                amount: `$${format(row.amount)}`
            }
        })

        const formattedTotalAmount = `$${format(totalAmount[0] ? totalAmount[0].total : 0)}`;

        return res.status(200).json({
            rows: formatRows,
            totalRows,
            totalAmount: formattedTotalAmount,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Algo salio mal, revisar logs del servidor.' })
    }
}