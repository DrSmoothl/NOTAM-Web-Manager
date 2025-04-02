export default {
  notam: {
    analysis: {
      region: {
        title: '区域分布分析',
        subtitle: '各区域NOTAM发布情况统计',
        total: '总数',
        active: '活跃',
        pending: '待处理',
        totalRegions: '区域总数',
        maxNotamsRegion: 'NOTAM最多区域',
        avgNotamsPerRegion: '区域平均NOTAM数',
        notams: '个NOTAM',
        notamCount: 'NOTAM数量',
        unit: '个',
        types: {
          total: '总数',
          active: '活跃',
          pending: '待处理'
        },
        tooltip: {
          notams: '个NOTAM'
        }
      }
    },
    regions: {
      north: '华北地区',
      northeast: '东北地区',
      east: '华东地区',
      south: '华南地区',
      central: '中南地区',
      southwest: '西南地区',
      northwest: '西北地区',
      xinjiang: '新疆地区'
    }
  }
} as const 