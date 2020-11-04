import * as React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { InputField } from '@console/shared';
import FormSection from '@console/dev-console/src/components/import/section/FormSection';
import { EventSources } from '../import-types';
import { useTranslation } from 'react-i18next';

interface CronJobSectionProps {
  title: string;
}

const CronJobSection: React.FC<CronJobSectionProps> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <FormSection title={title} extraMargin>
      <InputField
        type={TextInputTypes.text}
        name={`data.${EventSources.CronJobSource}.data`}
        label={t('knative-plugin~Data')}
        helpText={t('knative-plugin~The data posted to the target function')}
      />
      <InputField
        type={TextInputTypes.text}
        name={`data.${EventSources.CronJobSource}.schedule`}
        label={t('knative-plugin~Schedule')}
        helpText={t(
          'knative-plugin~Schedule is described using the unix-cron string format (* * * * *)',
        )}
        required
      />
    </FormSection>
  );
};

export default CronJobSection;
