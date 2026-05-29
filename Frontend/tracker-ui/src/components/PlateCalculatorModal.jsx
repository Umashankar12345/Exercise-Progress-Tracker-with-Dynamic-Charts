import React, { useMemo } from 'react';

export const PlateCalculatorModal = ({ targetWeight, onClose }) => {
  const barWeight = 20;

  const calculatedPlatesPerSide = useMemo(() => {
    if (targetWeight <= barWeight) return [];

    let targetSideWeight = (targetWeight - barWeight) / 2;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const plateCounts = [];

    availablePlates.forEach((plate) => {
      if (targetSideWeight >= plate) {
        const count = Math.floor(targetSideWeight / plate);
        if (count > 0) {
          plateCounts.push({ weight: plate, count });
          targetSideWeight -= count * plate;
        }
      }
    });

    return plateCounts;
  }, [targetWeight]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md p-6 border rounded-2xl bg-slate-900/80 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <h3 className="text-xl font-bold text-white mb-2">Barbell Plate Configuration</h3>
        <p className="text-sm text-slate-400 mb-6">
          Target: <span className="text-cyan-400 font-semibold">{targetWeight} kg</span> (Includes standard 20 kg bar)
        </p>

        <div className="space-y-3">
          {calculatedPlatesPerSide.length === 0 ? (
            <p className="text-center text-slate-500 py-4">Just load the bare barbell template.</p>
          ) : (
            calculatedPlatesPerSide.map((plate) => (
              <div
                key={plate.weight}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <span className="text-white font-medium">{plate.weight} kg Plate</span>
                <span className="px-3 py-1 text-xs font-black rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {plate.count} x Per Side
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl font-semibold text-sm bg-cyan-500 hover:bg-cyan-600 text-slate-950 transition-colors"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};

export default PlateCalculatorModal;
