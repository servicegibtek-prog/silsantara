import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Compass, 
  Download, 
  Info, 
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import { FamilyMember, Relationship } from '../../types';
import { PersonNode } from './PersonNode';
import { findKinshipPath } from '../../services/kinshipEngine';

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  relationships: Relationship[];
  currentUserId: string;
  selectedMember: FamilyMember | null;
  onSelectMember: (m: FamilyMember | null) => void;
  onOpenSearchModal: () => void;
  onExportImage: () => void;
}

interface NodePosition {
  member: FamilyMember;
  x: number;
  y: number;
}

interface CoupleUnit {
  id: string;
  partnerA: FamilyMember;
  partnerB?: FamilyMember;
  rel?: Relationship;
  children: FamilyMember[];
  generation: number;
  centerX: number;
  y: number;
}

export const FamilyTreeCanvas: React.FC<FamilyTreeCanvasProps> = ({
  members,
  relationships,
  currentUserId,
  selectedMember,
  onSelectMember,
  onOpenSearchModal,
  onExportImage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform states (pan and zoom)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 120, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [focusModeActive, setFocusModeActive] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

  // Width & height constants
  const NODE_WIDTH = 190;
  const NODE_HEIGHT = 92;
  const COUPLE_GAP = 36;
  const SIBLING_GAP = 48;
  const GEN_HEIGHT = 190;

  // Build genealogical layout
  const layout = useMemo(() => {
    const nodePositions = new Map<string, NodePosition>();
    const memberMap = new Map<string, FamilyMember>();
    members.forEach(m => memberMap.set(m.id, m));

    // Group members by generation
    const genMap = new Map<number, FamilyMember[]>();
    members.forEach(m => {
      const g = m.generation || 1;
      if (!genMap.has(g)) genMap.set(g, []);
      genMap.get(g)!.push(m);
    });

    const generations = Array.from(genMap.keys()).sort((a, b) => a - b);
    
    // We compute positions hierarchically
    // Find couple units and families
    const spouseRels = relationships.filter(r => r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE');
    const childRels = relationships.filter(r => r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT');

    // Layout Gen 1: Hasan & Siti
    const gen1 = genMap.get(1) || [];
    let startX = 200;
    
    // Place Gen 1
    if (gen1.length > 0) {
      const hasan = gen1.find(m => m.gender === 'male') || gen1[0];
      const siti = gen1.find(m => m.gender === 'female' && m.id !== hasan.id);

      nodePositions.set(hasan.id, { member: hasan, x: startX, y: 60 });
      if (siti) {
        nodePositions.set(siti.id, { member: siti, x: startX + NODE_WIDTH + COUPLE_GAP, y: 60 });
      }
    }

    // Layout Gen 2: Bambang (+Ratna), Dewi (+Irfan), Rahmat (+Maya)
    const gen2 = genMap.get(2) || [];
    let gen2X = 60;
    const gen2Units: { child: FamilyMember; spouse?: FamilyMember }[] = [];
    
    const processedGen2 = new Set<string>();
    gen2.forEach(m => {
      if (processedGen2.has(m.id)) return;
      // Check spouse
      const sRel = spouseRels.find(r => r.personAId === m.id || r.personBId === m.id);
      let spouse: FamilyMember | undefined;
      if (sRel) {
        const spouseId = sRel.personAId === m.id ? sRel.personBId : sRel.personAId;
        spouse = memberMap.get(spouseId);
        if (spouse) processedGen2.add(spouse.id);
      }
      processedGen2.add(m.id);

      // Primary branch member first (male or female who is child of Gen 1)
      const isBloodChild = childRels.some(r => r.personBId === m.id);
      if (spouse && !isBloodChild) {
        gen2Units.push({ child: spouse, spouse: m });
      } else {
        gen2Units.push({ child: m, spouse });
      }
    });

    gen2Units.forEach(unit => {
      const y = 60 + GEN_HEIGHT;
      nodePositions.set(unit.child.id, { member: unit.child, x: gen2X, y });
      if (unit.spouse) {
        nodePositions.set(unit.spouse.id, { member: unit.spouse, x: gen2X + NODE_WIDTH + COUPLE_GAP, y });
        gen2X += (NODE_WIDTH * 2) + COUPLE_GAP + SIBLING_GAP + 20;
      } else {
        gen2X += NODE_WIDTH + SIBLING_GAP;
      }
    });

    // Layout Gen 3: Rama (+Annisa), Dina; Rizky, Nadia; Arka
    const gen3 = genMap.get(3) || [];
    let gen3X = 60;
    const processedGen3 = new Set<string>();

    gen3.forEach(m => {
      if (processedGen3.has(m.id)) return;
      const sRel = spouseRels.find(r => r.personAId === m.id || r.personBId === m.id);
      let spouse: FamilyMember | undefined;
      if (sRel) {
        const spouseId = sRel.personAId === m.id ? sRel.personBId : sRel.personAId;
        spouse = memberMap.get(spouseId);
        if (spouse) processedGen3.add(spouse.id);
      }
      processedGen3.add(m.id);

      const y = 60 + (GEN_HEIGHT * 2);
      nodePositions.set(m.id, { member: m, x: gen3X, y });
      if (spouse) {
        nodePositions.set(spouse.id, { member: spouse, x: gen3X + NODE_WIDTH + COUPLE_GAP, y });
        gen3X += (NODE_WIDTH * 2) + COUPLE_GAP + SIBLING_GAP;
      } else {
        gen3X += NODE_WIDTH + SIBLING_GAP;
      }
    });

    // Layout Gen 4: Kayla
    const gen4 = genMap.get(4) || [];
    let gen4X = 140;
    gen4.forEach(m => {
      const y = 60 + (GEN_HEIGHT * 3);
      nodePositions.set(m.id, { member: m, x: gen4X, y });
      gen4X += NODE_WIDTH + SIBLING_GAP;
    });

    // Any remaining members not placed
    members.forEach(m => {
      if (!nodePositions.has(m.id)) {
        const g = m.generation || 1;
        const y = 60 + ((g - 1) * GEN_HEIGHT);
        nodePositions.set(m.id, { member: m, x: 800, y });
      }
    });

    return { nodePositions, memberMap, generations };
  }, [members, relationships]);

  // Determine focused path if selectedMember exists
  const focusedNodeIds = useMemo(() => {
    if (!selectedMember || !focusModeActive) return null;

    const set = new Set<string>();
    set.add(selectedMember.id);

    // Path to current user
    const pathResult = findKinshipPath(currentUserId, selectedMember.id, members, relationships);
    if (pathResult) {
      pathResult.path.forEach(p => set.add(p.person.id));
    }

    // Immediate spouse
    relationships.forEach(r => {
      if (r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE') {
        if (r.personAId === selectedMember.id) set.add(r.personBId);
        if (r.personBId === selectedMember.id) set.add(r.personAId);
      }
    });

    // Immediate children and parents
    relationships.forEach(r => {
      if (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') {
        if (r.personAId === selectedMember.id) set.add(r.personBId);
        if (r.personBId === selectedMember.id) set.add(r.personAId);
      }
    });

    return set;
  }, [selectedMember, focusModeActive, currentUserId, members, relationships]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.4), 2.2));
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 2.2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.4));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 120, y: 80 });
  };

  // Center on user or root
  const handleCenterRoot = () => {
    setZoom(1);
    setPan({ x: 100, y: 60 });
  };

  return (
    <div 
      className="relative h-full w-full overflow-hidden bg-[#FAF8F5] select-none"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#D6CEBE 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute left-6 top-6 z-20 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#E6E3DA] bg-white/95 p-1.5 shadow-md backdrop-blur-xs">
        <button
          onClick={handleZoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#57534E] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          title="Perbesar (Zoom In)"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#57534E] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          title="Perkecil (Zoom Out)"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-[#E6E3DA]" />

        <button
          onClick={handleReset}
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#57534E] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          title="Pusatkan Tampilan"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pusatkan</span>
        </button>

        <button
          onClick={() => setFocusModeActive(!focusModeActive)}
          className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium transition ${
            focusModeActive 
              ? 'bg-[#EBF2EE] text-[#1E3A2F]' 
              : 'text-[#78716C] hover:bg-[#F2EFEA]'
          }`}
          title="Mode Fokus (Sorot Cabang Terkait)"
        >
          {focusModeActive ? <Eye className="h-3.5 w-3.5 text-[#2D5A46]" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">Fokus</span>
        </button>

        <div className="h-4 w-px bg-[#E6E3DA]" />

        <button
          onClick={onOpenSearchModal}
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#1E3A2F] hover:bg-[#EBF2EE] transition"
          title="Cari Hubungan Kerabat"
        >
          <Compass className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cari Hubungan</span>
        </button>
      </div>

      {/* Floating Action: Legend & Export (Top Right) */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`flex h-9 items-center gap-1.5 rounded-xl border border-[#E6E3DA] bg-white/95 px-3 text-xs font-medium shadow-md backdrop-blur-xs transition ${
            showLegend ? 'bg-[#EBF2EE] text-[#1E3A2F]' : 'text-[#57534E] hover:bg-[#F2EFEA]'
          }`}
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Petunjuk Garis</span>
        </button>

        <button
          onClick={onExportImage}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E6E3DA] bg-white/95 px-3 text-xs font-medium text-[#57534E] shadow-md backdrop-blur-xs hover:bg-[#F2EFEA] transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Unduh Silsilah</span>
        </button>
      </div>

      {/* Legend Card */}
      {showLegend && (
        <div className="absolute right-6 top-20 z-20 w-64 rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xl text-xs space-y-2.5">
          <div className="font-serif font-semibold text-[#1C1917] pb-1 border-b border-[#F0EDE6]">
            Keterangan Garis Hubungan
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 border-t-2 border-[#2D5A46]" />
            <span className="text-[#57534E]">Garis Keturunan Kandung</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 border-t-2 border-dashed border-[#8C6D46]" />
            <span className="text-[#57534E]">Garis Adopsi / Asuh</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 flex items-center justify-center">
              <div className="w-full border-t border-[#A8A29E]" />
            </div>
            <span className="text-[#57534E]">Ikatan Pernikahan (Pasangan)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#1E3A2F]" />
            <span className="text-[#57534E]">Titik Anda (Pengguna Aktif)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-[#78716C] font-semibold text-xs pl-1">†</span>
            <span className="text-[#78716C]">Almarhum / Telah Wafat</span>
          </div>
        </div>
      )}

      {/* Main Canvas SVG and HTML Elements with pan/zoom transform */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {/* Generational Tier Watermark Rails on the left */}
        <div className="absolute -left-20 top-0 select-none pointer-events-none space-y-[150px] text-xs font-serif italic text-[#A8A29E]/60 tracking-wider">
          <div className="h-[92px] flex items-center">Generasi I · Sesepuh & Perintis</div>
          <div className="h-[92px] flex items-center">Generasi II · Orang Tua</div>
          <div className="h-[92px] flex items-center">Generasi III · Anak & Cucu</div>
          <div className="h-[92px] flex items-center">Generasi IV · Cicit</div>
        </div>

        {/* SVG Relationship Connector Lines */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ width: 2800, height: 1800, overflow: 'visible' }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#1E3A2F" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* 1. Spouse Horizontal Lines */}
          {relationships.filter(r => r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE').map(rel => {
            const posA = layout.nodePositions.get(rel.personAId);
            const posB = layout.nodePositions.get(rel.personBId);
            if (!posA || !posB) return null;

            const isFormer = rel.type === 'FORMER_SPOUSE' || rel.status === 'BERCERAI';
            const isHighlighted = focusedNodeIds?.has(rel.personAId) && focusedNodeIds?.has(rel.personBId);

            // Connect middle right of left node to middle left of right node
            const left = posA.x < posB.x ? posA : posB;
            const right = posA.x < posB.x ? posB : posA;

            const x1 = left.x + NODE_WIDTH;
            const y1 = left.y + (NODE_HEIGHT / 2);
            const x2 = right.x;
            const y2 = right.y + (NODE_HEIGHT / 2);

            return (
              <g key={rel.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHighlighted ? '#1E3A2F' : '#94A3B8'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isFormer ? '4 3' : undefined}
                />
                {/* Small marriage connector badge in middle */}
                <circle
                  cx={(x1 + x2) / 2}
                  cy={(y1 + y2) / 2}
                  r="3.5"
                  fill="#FFFFFF"
                  stroke={isHighlighted ? '#1E3A2F' : '#64748B'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* 2. Parent-Child Branch Lines */}
          {/* We connect parental units downward to children */}
          {/* Gen 1 (Hasan & Siti) -> Gen 2 (Bambang, Dewi, Rahmat) */}
          {(() => {
            const hasan = layout.nodePositions.get('mem_hasan_1940');
            const siti = layout.nodePositions.get('mem_siti_1944');
            const bambang = layout.nodePositions.get('mem_bambang_1968');
            const dewi = layout.nodePositions.get('mem_dewi_1973');
            const rahmat = layout.nodePositions.get('mem_rahmat_1979');

            if (!hasan || !siti || !bambang || !dewi || !rahmat) return null;

            const parentMidX = (hasan.x + NODE_WIDTH + siti.x) / 2;
            const parentBottomY = hasan.y + NODE_HEIGHT;
            const busBarY = parentBottomY + 45;

            const children = [bambang, dewi, rahmat];
            const minChildX = Math.min(...children.map(c => c.x + (NODE_WIDTH / 2)));
            const maxChildX = Math.max(...children.map(c => c.x + (NODE_WIDTH / 2)));

            return (
              <g key="gen1_branch">
                {/* Stem from parents */}
                <line x1={parentMidX} y1={parentBottomY} x2={parentMidX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                {/* Horizontal bus bar */}
                <line x1={minChildX} y1={busBarY} x2={maxChildX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                {/* Drops to children */}
                {children.map(c => (
                  <line 
                    key={c.member.id} 
                    x1={c.x + (NODE_WIDTH / 2)} 
                    y1={busBarY} 
                    x2={c.x + (NODE_WIDTH / 2)} 
                    y2={c.y} 
                    stroke="#2D5A46" 
                    strokeWidth="2" 
                  />
                ))}
              </g>
            );
          })()}

          {/* Gen 2 (Bambang & Ratna) -> Gen 3 (Rama, Dina) */}
          {(() => {
            const bambang = layout.nodePositions.get('mem_bambang_1968');
            const ratna = layout.nodePositions.get('mem_ratna_1970');
            const rama = layout.nodePositions.get('mem_rama_1996');
            const dina = layout.nodePositions.get('mem_dina_2000');

            if (!bambang || !ratna || !rama || !dina) return null;

            const parentMidX = (bambang.x + NODE_WIDTH + ratna.x) / 2;
            const parentBottomY = bambang.y + NODE_HEIGHT;
            const busBarY = parentBottomY + 45;

            const children = [rama, dina];
            const minX = Math.min(...children.map(c => c.x + (NODE_WIDTH / 2)));
            const maxX = Math.max(...children.map(c => c.x + (NODE_WIDTH / 2)));

            return (
              <g key="bambang_branch">
                <line x1={parentMidX} y1={parentBottomY} x2={parentMidX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                <line x1={minX} y1={busBarY} x2={maxX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                {children.map(c => (
                  <line 
                    key={c.member.id} 
                    x1={c.x + (NODE_WIDTH / 2)} 
                    y1={busBarY} 
                    x2={c.x + (NODE_WIDTH / 2)} 
                    y2={c.y} 
                    stroke="#2D5A46" 
                    strokeWidth="2" 
                  />
                ))}
              </g>
            );
          })()}

          {/* Gen 2 (Dewi & Irfan) -> Gen 3 (Rizky, Nadia) */}
          {(() => {
            const dewi = layout.nodePositions.get('mem_dewi_1973');
            const irfan = layout.nodePositions.get('mem_irfan_1971');
            const rizky = layout.nodePositions.get('mem_rizky_1998');
            const nadia = layout.nodePositions.get('mem_nadia_2004');

            if (!dewi || !irfan || !rizky || !nadia) return null;

            const parentMidX = (dewi.x + NODE_WIDTH + irfan.x) / 2;
            const parentBottomY = dewi.y + NODE_HEIGHT;
            const busBarY = parentBottomY + 45;

            const children = [rizky, nadia];
            const minX = Math.min(...children.map(c => c.x + (NODE_WIDTH / 2)));
            const maxX = Math.max(...children.map(c => c.x + (NODE_WIDTH / 2)));

            return (
              <g key="dewi_branch">
                <line x1={parentMidX} y1={parentBottomY} x2={parentMidX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                <line x1={minX} y1={busBarY} x2={maxX} y2={busBarY} stroke="#2D5A46" strokeWidth="2" />
                {children.map(c => (
                  <line 
                    key={c.member.id} 
                    x1={c.x + (NODE_WIDTH / 2)} 
                    y1={busBarY} 
                    x2={c.x + (NODE_WIDTH / 2)} 
                    y2={c.y} 
                    stroke="#2D5A46" 
                    strokeWidth="2" 
                  />
                ))}
              </g>
            );
          })()}

          {/* Gen 2 (Rahmat & Maya) -> Gen 3 (Arka) */}
          {(() => {
            const rahmat = layout.nodePositions.get('mem_rahmat_1979');
            const maya = layout.nodePositions.get('mem_maya_1982');
            const arka = layout.nodePositions.get('mem_arka_2012');

            if (!rahmat || !maya || !arka) return null;

            const parentMidX = (rahmat.x + NODE_WIDTH + maya.x) / 2;
            const parentBottomY = rahmat.y + NODE_HEIGHT;
            const childTopX = arka.x + (NODE_WIDTH / 2);

            return (
              <g key="rahmat_branch">
                <path
                  d={`M ${parentMidX} ${parentBottomY} V ${parentBottomY + 45} H ${childTopX} V ${arka.y}`}
                  fill="none"
                  stroke="#2D5A46"
                  strokeWidth="2"
                />
              </g>
            );
          })()}

          {/* Gen 3 (Rama & Annisa) -> Gen 4 (Kayla) */}
          {(() => {
            const rama = layout.nodePositions.get('mem_rama_1996');
            const annisa = layout.nodePositions.get('mem_annisa_1998');
            const kayla = layout.nodePositions.get('mem_kayla_2024');

            if (!rama || !annisa || !kayla) return null;

            const parentMidX = (rama.x + NODE_WIDTH + annisa.x) / 2;
            const parentBottomY = rama.y + NODE_HEIGHT;
            const childTopX = kayla.x + (NODE_WIDTH / 2);

            return (
              <g key="rama_branch">
                <path
                  d={`M ${parentMidX} ${parentBottomY} V ${parentBottomY + 45} H ${childTopX} V ${kayla.y}`}
                  fill="none"
                  stroke="#2D5A46"
                  strokeWidth="2"
                />
              </g>
            );
          })()}
        </svg>

        {/* HTML Person Nodes */}
        {Array.from(layout.nodePositions.values()).map(pos => {
          const isSelected = selectedMember?.id === pos.member.id;
          const isFocusedPath = focusedNodeIds ? focusedNodeIds.has(pos.member.id) : false;
          const isDimmed = Boolean(focusedNodeIds && !isFocusedPath);
          const isCurrentUser = pos.member.id === currentUserId;

          return (
            <div
              key={pos.member.id}
              className="absolute"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
              }}
            >
              <PersonNode
                member={pos.member}
                isSelected={isSelected}
                isDimmed={isDimmed}
                isFocusedPath={isFocusedPath}
                isCurrentUser={isCurrentUser}
                onSelect={(m) => onSelectMember(m)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
