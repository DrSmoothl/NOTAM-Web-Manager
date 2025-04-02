export default {
  notam: {
    analysis: {
      region: {
        title: 'Regional Distribution Analysis',
        subtitle: 'NOTAM Statistics by Region',
        total: 'Total',
        active: 'Active',
        pending: 'Pending',
        totalRegions: 'Total Regions',
        maxNotamsRegion: 'Region with Most NOTAMs',
        avgNotamsPerRegion: 'Average NOTAMs per Region',
        notams: 'NOTAMs',
        notamCount: 'NOTAM Count',
        unit: '',
        types: {
          total: 'Total',
          active: 'Active',
          pending: 'Pending'
        },
        tooltip: {
          notams: 'NOTAMs'
        }
      }
    },
    regions: {
      north: 'North China',
      northeast: 'Northeast China',
      east: 'East China',
      south: 'South China',
      central: 'Central-South China',
      southwest: 'Southwest China',
      northwest: 'Northwest China',
      xinjiang: 'Xinjiang'
    }
  }
} as const 