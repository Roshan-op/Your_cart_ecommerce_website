import React from 'react';
import { useLocation } from 'react-router-dom';

/* ─── Size data ─────────────────────────────────────────────────────────── */

const CHARTS = {
  footwear: {
    title: 'Footwear Size Guide',
    subtitle: 'Measure your foot length while standing. If between sizes, go up.',
    tip: 'Tip: Measure in the evening when feet are slightly larger for the best fit.',
    columns: ['UK', 'US Men', 'US Women', 'EU', 'Foot Length (cm)', 'Foot Length (in)'],
    rows: [
      ['3', '4',  '5',  '35–36', '21.5', '8.5'],
      ['4', '5',  '6',  '37',    '22.5', '8.9'],
      ['5', '6',  '7',  '38',    '23.5', '9.3'],
      ['6', '7',  '8',  '39',    '24.5', '9.6'],
      ['7', '8',  '9',  '40–41', '25.5', '10.0'],
      ['8', '9',  '10', '42',    '26.5', '10.4'],
      ['9', '10', '11', '43',    '27.5', '10.8'],
      ['10','11', '12', '44–45', '28.5', '11.2'],
      ['11','12', '13', '46',    '29.5', '11.6'],
      ['12','13', '14', '47',    '30.5', '12.0'],
    ],
    howTo: [
      { step: '1', label: 'Prepare', desc: 'Place a sheet of paper on a hard floor and stand on it.' },
      { step: '2', label: 'Trace', desc: 'Trace the outline of your foot with a pencil held vertically.' },
      { step: '3', label: 'Measure', desc: 'Measure the longest distance from heel to toe in centimetres.' },
      { step: '4', label: 'Match', desc: 'Find your measurement in the "Foot Length" column above.' },
    ],
  },

  clothing: {
    title: 'Clothing Size Guide',
    subtitle: 'Applies to Jackets, Hoodies, and T-Shirts. Measure your body, not the garment.',
    tip: 'Tip: For a relaxed fit go one size up; for a slim fit, stay true to size.',
    columns: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)', 'Shoulder (cm)'],
    rows: [
      ['XS',  '80–84',   '64–68',   '86–90',   '40'],
      ['S',   '84–88',   '68–72',   '90–94',   '42'],
      ['M',   '88–92',   '72–76',   '94–98',   '44'],
      ['L',   '92–97',   '76–81',   '98–103',  '46'],
      ['XL',  '97–104',  '81–88',   '103–110', '48'],
      ['XXL', '104–112', '88–96',   '110–118', '51'],
    ],
    howTo: [
      { step: '1', label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape level.' },
      { step: '2', label: 'Waist', desc: 'Measure around your natural waistline, the narrowest point.' },
      { step: '3', label: 'Hip', desc: 'Measure around the fullest part of your hips, about 20 cm below your waist.' },
      { step: '4', label: 'Shoulder', desc: 'Measure from shoulder point to shoulder point across the back.' },
    ],
  },

  bracelet: {
    title: 'Bracelet Size Guide',
    subtitle: 'Measure your wrist circumference for the perfect bracelet fit.',
    tip: 'Tip: Add 1–2 cm to your wrist measurement for a comfortable, relaxed fit.',
    columns: ['Size', 'Wrist Circumference (cm)', 'Wrist Circumference (in)', 'Best for'],
    rows: [
      ['S', '13–15', '5.1–5.9', 'Slim / Small wrist'],
      ['M', '15–17', '5.9–6.7', 'Average wrist'],
      ['L', '17–19', '6.7–7.5', 'Large / Wide wrist'],
    ],
    howTo: [
      { step: '1', label: 'Get string', desc: 'Wrap a flexible tape or a piece of string around your wrist.' },
      { step: '2', label: 'Mark', desc: 'Mark where the tape meets itself.' },
      { step: '3', label: 'Measure', desc: 'Lay the string flat and measure its length against a ruler.' },
      { step: '4', label: 'Match', desc: 'Find your wrist measurement in the table above and pick your size.' },
    ],
  },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

const SizeChartPage = () => {
  const { search } = useLocation();
  const type = new URLSearchParams(search).get('type') || 'clothing';
  const chart = CHARTS[type] || CHARTS.clothing;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Size Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{chart.title}</h1>
          <p className="text-gray-500 max-w-xl mx-auto">{chart.subtitle}</p>
        </div>

        {/* Tip Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg px-5 py-4 mb-8 flex items-start gap-3">
          <span className="text-amber-500 text-xl flex-shrink-0">💡</span>
          <p className="text-amber-800 text-sm leading-relaxed">{chart.tip}</p>
        </div>

        {/* Size Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {chart.columns.map((col) => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left font-semibold tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-5 py-3.5 ${j === 0 ? 'font-bold text-gray-900' : 'text-gray-600'} whitespace-nowrap`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {chart.howTo.map(({ step, label, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{label}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400">
          Measurements are approximate. If you are between sizes, we recommend sizing up.
          Contact us if you need further assistance.
        </p>
      </div>
    </div>
  );
};

export default SizeChartPage;
