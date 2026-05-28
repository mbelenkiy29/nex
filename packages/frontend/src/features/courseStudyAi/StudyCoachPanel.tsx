import { LuCompass } from 'react-icons/lu';
import { useAuthStore } from '@/features/auth/authStore';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AiPrivacyControlsSheet } from '@/features/aiTrust/AiPrivacyControlsSheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { StudyPlanList } from './StudyPlanList';
import { WeaknessChart } from './WeaknessChart';
import { WhatNextCard } from './WhatNextCard';

/**
 * Course-level AI study coach for the player's right column: weakness
 * detection, "what to study next", and the AI study plan.
 */
export function StudyCoachPanel({ courseId }: { courseId: string }) {
  const dictionary = useAuthStore((state) => state.dictionary);
  const t = dictionary.course.studyAi.coach;

  return (
    <Card className="nex-glass-card rounded-3xl border-white/70 p-0 dark:border-white/10">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-extrabold">
            <LuCompass className="text-primary size-5" />
            {t.title}
          </h2>
          <AiPrivacyControlsSheet />
        </div>
        <Tabs defaultValue="weak">
          <TabsList className="w-full">
            <TabsTrigger value="weak">{t.weakAreasTab}</TabsTrigger>
            <TabsTrigger value="next">{t.whatNextTab}</TabsTrigger>
            <TabsTrigger value="plan">{t.studyPlanTab}</TabsTrigger>
          </TabsList>
          <TabsContent value="weak" className="pt-3">
            <WeaknessChart courseId={courseId} />
          </TabsContent>
          <TabsContent value="next" className="pt-3">
            <WhatNextCard courseId={courseId} />
          </TabsContent>
          <TabsContent value="plan" className="pt-3">
            <StudyPlanList courseId={courseId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
