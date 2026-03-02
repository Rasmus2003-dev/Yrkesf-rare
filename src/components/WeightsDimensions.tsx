import { useState } from 'react';
import { Scale, ArrowLeftRight, Truck, Info } from 'lucide-react';

export default function WeightsDimensions() {
  return (
    <div className="p-4 pb-24">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vikter & Mått</h2>
        <p className="text-slate-500 dark:text-slate-400">Referens för svenska vägar</p>
      </header>

      <div className="space-y-6">
        {/* Bärighetsklasser */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Scale size={20} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Bruttovikter (BK)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2 font-semibold text-slate-900 dark:text-white">Vägklass</th>
                  <th className="pb-2 font-semibold text-slate-900 dark:text-white">Max Bruttovikt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-300">BK1</td>
                  <td className="py-2 font-medium text-slate-900 dark:text-white">64 ton (74 ton på vissa vägar)</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-300">BK2</td>
                  <td className="py-2 font-medium text-slate-900 dark:text-white">51.4 ton</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-300">BK3</td>
                  <td className="py-2 font-medium text-slate-900 dark:text-white">37.5 ton</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-600 dark:text-slate-300">BK4</td>
                  <td className="py-2 font-medium text-slate-900 dark:text-white">74 ton</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Axeltryck */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Max Axeltryck (BK1)</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Drivande axel</span>
              <span className="font-medium text-slate-900 dark:text-white">11.5 ton</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Icke drivande axel</span>
              <span className="font-medium text-slate-900 dark:text-white">10 ton</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Boggi (drivande) &lt; 1.3m</span>
              <span className="font-medium text-slate-900 dark:text-white">11.5 ton</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Boggi (drivande) &ge; 1.3m &lt; 1.8m</span>
              <span className="font-medium text-slate-900 dark:text-white">18 ton (19 ton*)</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">Trippelaxel &le; 1.3m</span>
              <span className="font-medium text-slate-900 dark:text-white">21 ton (24 ton*)</span>
            </div>
            <p className="text-xs text-slate-400">* Gäller vid luftfjädring eller likvärdigt.</p>
          </div>
        </div>

        {/* Längder */}
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <ArrowLeftRight size={20} />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Max Längder</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Lastbil</span>
              <span className="font-medium text-slate-900 dark:text-white">12.00 m</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Lastbil + Släp</span>
              <span className="font-medium text-slate-900 dark:text-white">24.00 m</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Modulvogntåg (EES)</span>
              <span className="font-medium text-slate-900 dark:text-white">25.25 m</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Semitrailer (Kingpin-Bak)</span>
              <span className="font-medium text-slate-900 dark:text-white">12.00 m</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">Bredd (Normalt)</span>
              <span className="font-medium text-slate-900 dark:text-white">2.55 m (2.60 m kyl)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
