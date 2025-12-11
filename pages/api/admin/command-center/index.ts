import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  getCommandCenterStats, 
  generateMockData, 
  exportToCSV,
  TimeFilter,
  CommandCenterStats 
} from '../../../../lib/commandCenterService';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<CommandCenterStats | { csv: string } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filter = '30days', format } = req.query;
    
    const validFilters: TimeFilter[] = ['today', '7days', '30days', '90days', 'year'];
    const timeFilter: TimeFilter = validFilters.includes(filter as TimeFilter) 
      ? (filter as TimeFilter) 
      : '30days';

    let stats: CommandCenterStats;
    
    try {
      stats = await getCommandCenterStats(timeFilter);
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);
      stats = generateMockData(timeFilter);
    }

    if (format === 'csv') {
      const csv = exportToCSV(stats);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=command-center-${timeFilter}-${new Date().toISOString().split('T')[0]}.csv`);
      return res.status(200).send(csv as any);
    }

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Command center API error:', error);
    return res.status(200).json(generateMockData('30days'));
  }
}
