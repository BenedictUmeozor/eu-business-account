import { useState } from "react";
import useSharedMutationAction from "./use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { message } from "antd";
import { getErrorMessage } from "@/utils";
import { useAppSelector } from ".";

interface SecurityQuestion {
  question_id: string;
  question: string;
  answer: string;
}

export default function useSecurityQuestions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useAppSelector(state => state.session);

  const securityQuestionMutation = useSharedMutationAction<any>({
    url: ENDPOINTS.SET_SECURITY_QUESTION,
    onSuccess: () => {},
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const submitSecurityQuestions = async (
    questions: SecurityQuestion[],
    onSuccess: () => void
  ) => {
    try {
      setIsSubmitting(true);

      // Submit each question separately
      const promises = questions.map(question =>
        securityQuestionMutation.mutateAsync({
          ...question,
          user_token: session.user?.user_token,
        })
      );

      await Promise.all(promises);
      message.success("Security questions saved successfully");
      onSuccess();
    } catch {
      message.error("Failed to save security questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitSecurityQuestions,
    isSubmitting,
  };
}
