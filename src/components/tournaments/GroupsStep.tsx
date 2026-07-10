import { useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Team } from "@/lib/types";
import { distribute, groupOptions, GROUP_LETTERS } from "@/lib/tournament/draft";
import { Field, Segmented, StepCard, WizardButton } from "./wizard";

interface GroupsStepProps {
  teams: Team[];
  numGroups: number;
  setNumGroups: (n: number) => void;
  qualifyCount: number;
  setQualifyCount: (n: number) => void;
  withKnockout: boolean;
  setWithKnockout: (on: boolean) => void;
  bracketValid: boolean;
  busy: boolean;
  onSubmit: (groups: number[][]) => void;
}

function swapTeams(groups: number[][], a: number, b: number): number[][] {
  return groups.map((ids) => ids.map((id) => (id === a ? b : id === b ? a : id)));
}

export function GroupsStep({
  teams,
  numGroups,
  setNumGroups,
  qualifyCount,
  setQualifyCount,
  withKnockout,
  setWithKnockout,
  bracketValid,
  busy,
  onSubmit,
}: GroupsStepProps) {
  const [groups, setGroups] = useState(() => distribute(teams, numGroups));
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(Number(active.id));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (over && active.id !== over.id) {
      setGroups((current) => swapTeams(current, Number(active.id), Number(over.id)));
    }
  }

  const activeTeam = teams.find((t) => t.id === activeId);

  return (
    <StepCard title="Split into groups">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Groups">
          <Segmented
            options={groupOptions(teams.length)}
            value={numGroups}
            onChange={setNumGroups}
          />
        </Field>
        <Field label="Advance per group">
          <Segmented options={[1, 2]} value={qualifyCount} onChange={setQualifyCount} />
        </Field>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {groups.map((teamIds, index) => (
            <div key={index} className="rounded-[9px] border border-line bg-surface p-3">
              <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-amber-ink">
                Group {GROUP_LETTERS[index]}
              </div>
              <ul className="flex flex-col gap-1">
                {teamIds.map((id) => (
                  <TeamChip key={id} team={teams.find((t) => t.id === id)} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {activeTeam &&
          createPortal(
            <DragOverlay dropAnimation={null}>
              <div className="flex cursor-grabbing items-center gap-2 rounded-[7px] border border-amber-line bg-surface-3 px-2 py-1 text-[13px] text-ink shadow-lg">
                <span>{activeTeam.flag}</span>
                <span className="truncate">{activeTeam.name}</span>
              </div>
            </DragOverlay>,
            document.body,
          )}
      </DndContext>

      <p className="mt-2.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-mute">
        Drag a team onto another to swap their spots
      </p>

      <label className="mt-4 flex items-center gap-2.5 text-[13px] text-ink-dim">
        <input
          type="checkbox"
          checked={withKnockout && bracketValid}
          disabled={!bracketValid}
          onChange={(e) => setWithKnockout(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-amber)]"
        />
        Also generate the knockout bracket
        {!bracketValid && (
          <span className="font-mono text-[10.5px] text-ink-mute">
            (needs 4, 8 or 16 qualifiers)
          </span>
        )}
      </label>

      <WizardButton disabled={busy} onClick={() => onSubmit(groups)}>
        {busy ? "Generating…" : "Create tournament"}
      </WizardButton>
    </StepCard>
  );
}

function TeamChip({ team }: { team?: Team }) {
  const drag = useDraggable({ id: team?.id ?? 0 });
  const drop = useDroppable({ id: team?.id ?? 0 });

  if (!team) return null;

  return (
    <li
      ref={(node) => {
        drag.setNodeRef(node);
        drop.setNodeRef(node);
      }}
      {...drag.listeners}
      {...drag.attributes}
      className={[
        "flex cursor-grab items-center gap-2 rounded-[7px] border px-2 py-1 text-[13px] transition-colors",
        drag.isDragging
          ? "border-dashed border-line-2 text-ink-mute opacity-50"
          : drop.isOver
            ? "border-amber-line bg-amber/10 text-ink"
            : "border-transparent text-ink-dim hover:border-line-2",
      ].join(" ")}
    >
      <span>{team.flag}</span>
      <span className="truncate">{team.name}</span>
    </li>
  );
}
