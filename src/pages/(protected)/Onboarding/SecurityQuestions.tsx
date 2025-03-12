import HeaderTitle from "@/components/ui/HeaderTitle";
import ENDPOINTS from "@/constants/endpoints";
import useSecurityQuestions from "@/hooks/use-security-questions";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Button, Input, message, Select } from "antd";
import { useEffect, useState } from "react";

interface QuestionState {
  questionId: string;
  question: string;
  answer: string;
}

const SecurityQuestions = ({ next }: { next: () => void }) => {
  const [questions, setQuestions] = useState<HM.Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionState[]>([
    { questionId: "", question: "", answer: "" },
    { questionId: "", question: "", answer: "" },
    { questionId: "", question: "", answer: "" },
  ]);

  const { submitSecurityQuestions, isSubmitting } = useSecurityQuestions();

  const questionMutation = useSharedMutationAction<{
    questions: { data: HM.Question[] };
  }>({
    url: ENDPOINTS.FETCH_SECURITY_QUESTIONS,
    onSuccess: data => {
      setQuestions(data?.questions?.data);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    questionMutation.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuestionChange = (value: string, index: number) => {
    console.log(value, index);
    const selectedQuestion = questions.find(
      q => q.question_id.toString() == value
    );
    if (!selectedQuestion) return;

    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[index] = {
      ...newSelectedQuestions[index],
      questionId: selectedQuestion.question_id.toString(),
      question: selectedQuestion.question,
    };
    setSelectedQuestions(newSelectedQuestions);
  };

  const handleAnswerChange = (value: string, index: number) => {
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[index] = {
      ...newSelectedQuestions[index],
      answer: value,
    };
    setSelectedQuestions(newSelectedQuestions);
  };

  const isFormValid = () => {
    const allQuestionsAnswered = selectedQuestions.every(
      q => q.questionId && q.answer
    );

    const uniqueQuestionIds = new Set(
      selectedQuestions.map(q => q.questionId).filter(id => id !== "")
    );
    const hasUniqueQuestions = uniqueQuestionIds.size === 3;

    return allQuestionsAnswered && hasUniqueQuestions;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const questionsToSubmit = selectedQuestions.map(q => ({
      question_id: q.questionId,
      question: q.question,
      answer: q.answer,
    }));

    await submitSecurityQuestions(questionsToSubmit, next);
  };

  const getAvailableQuestions = (index: number) => {
    const selectedIds = selectedQuestions
      .map(q => q.questionId)
      .filter((id, i) => i !== index && id !== "");

    return questions.filter(
      q => !selectedIds.includes(q.question_id.toString())
    );
  };

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerDescription="Add security question to your account"
        headerTitle="Security Questions"
      />
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 gap-y-6">
        {selectedQuestions.map((selectedQ, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">
              Select a security question
            </p>
            <div className="space-y-2">
              <Select
                className="w-full"
                placeholder="Select Question"
                value={selectedQ.question || undefined}
                onChange={value => handleQuestionChange(value, index)}
                options={getAvailableQuestions(index).map(q => ({
                  label: q.question,
                  value: q.question_id,
                }))}
                loading={questionMutation.isPending}
              />
              <Input
                className="w-full"
                placeholder="Enter Answer"
                value={selectedQ.answer}
                onChange={e => handleAnswerChange(e.target.value, index)}
                disabled={!selectedQ.questionId}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        type="primary"
        size="large"
        className="w-48"
        shape="round"
        onClick={handleSubmit}
        disabled={!isFormValid() || isSubmitting}
        loading={isSubmitting}>
        Next
      </Button>
    </div>
  );
};

export default SecurityQuestions;
