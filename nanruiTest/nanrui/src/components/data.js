// data.js
export const citiesData = [
  {
    name: '省A',
    code: '001',
    cities: [
      {
        name: '市A1',
        code: '001-1',
        districts: [
          { name: '区A1-1', code: '001-1-1' },
          { name: '区A1-2', code: '001-1-2' }
        ]
      },
      {
        name: '市A2',
        code: '001-2',
        districts: [
          { name: '区A2-1', code: '001-2-1' },
          { name: '区A2-2', code: '001-2-2' }
        ]
      }
    ]
  },
  {
    name: '省B',
    code: '002',
    cities: [
      {
        name: '市B1',
        code: '002-1',
        districts: [{ name: '区B1-1', code: '002-1-1' }]
      }
    ]
  }
]
