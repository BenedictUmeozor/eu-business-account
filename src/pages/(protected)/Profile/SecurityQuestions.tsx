import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from "@/hooks";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Alert, Button, Divider, Form, Input, message, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";

interface ErrorState {
  question_id: string;
  error: boolean;
}

const SecurityQuestions = ({
  next,
  show,
}: {
  show: boolean;
  next: () => void;
}) => {
  const session = useAppSelector(state => state.session);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [questions, setQuestions] = useState<HM.Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([
    { questionId: "", question: "", answer: "", correct: false },
    { questionId: "", question: "", answer: "", correct: false },
    { questionId: "", question: "", answer: "", correct: false },
  ]);

  const questionMutation = useSharedMutationAction<{
    questions: { data: HM.Question[] };
  }>({
    url: ENDPOINTS.FETCH_USER_SECURITY_QUESTIONS,
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

  const handleAnswerChange = (value: string, index: number) => {
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[index] = {
      ...newAnsweredQuestions[index],
      questionId: questions[index]?.question_id.toString() || "",
      question: questions[index]?.question || "",
      answer: value,
    };
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const mutation = useSharedMutationAction<
    HM.QueryResponse,
    {
      user_token: string;
      question_id: string;
      question: string;
      answer: string;
    }
  >({
    url: ENDPOINTS.VERIFY_SECURITY_QUESTION,
    onSuccess: (_, variables) => {
      setErrors(prevErrors =>
        prevErrors.filter(e => e.question_id !== variables.question_id)
      );
      setAnsweredQuestions(prev =>
        prev.map(q =>
          q.questionId === variables.question_id ? { ...q, correct: true } : q
        )
      );
    },
    onError: (_, variables) => {
      // const newErrors = [...errors];
      // const errorIndex = newErrors.findIndex(
      //   error => error.question_id === variables.question_id
      // );
      // if (errorIndex === -1) {
      //   newErrors.push({ question_id: variables.question_id, error: true });
      // } else {
      //   newErrors[errorIndex].error = true;
      // }
      // setErrors(newErrors);
      setErrors(prevErrors => {
        const err = prevErrors.find(
          e => e.question_id === variables.question_id
        );
        if (err) {
          return prevErrors.map(e =>
            e.question_id === variables.question_id ? { ...e, error: true } : e
          );
        } else {
          return [
            ...prevErrors,
            { question_id: variables.question_id, error: true },
          ];
        }
      });
    },
  });

  const isFormValid = useMemo(() => {
    return answeredQuestions.every(q => q.answer.trim() !== "");
  }, [answeredQuestions]);

  const allCorrect = useMemo(() => {
    return answeredQuestions.every(q => q.correct === true);
  }, [answeredQuestions]);

  useEffect(() => {
    if (!show) {
      setAnsweredQuestions([
        { questionId: "", question: "", answer: "", correct: false },
        { questionId: "", question: "", answer: "", correct: false },
        { questionId: "", question: "", answer: "", correct: false },
      ]);
      setErrors([]);
      setLoading(false);
    }
  }, [show]);

  const handleSubmit = async () => {
    try {
      setErrors([]);
      setLoading(true);
      await Promise.all([
        ...answeredQuestions.map(({ questionId, answer, question }) =>
          mutation.mutateAsync({
            user_token: session.user?.user_token as string,
            question_id: questionId,
            answer,
            question,
          })
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allCorrect) {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCorrect]);

  return (
    <>
      {questionMutation.isPending && (
        <div className="flex items-center justify-center h-36">
          <Spin />
        </div>
      )}
      {!questionMutation.isPending && (
        <div className="max-w-3xl">
          <Form
            layout="horizontal"
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 10 }}
            labelAlign="left">
            {questions.map((question, index) => {
              const error = errors.find(
                error => error.question_id === question.question_id.toString()
              );

              return (
                <Form.Item
                  key={question.question_id}
                  label={
                    <span className="text-grey-500 font-medium">
                      {index === 0 ? "First" : index === 1 ? "Second" : "Third"}{" "}
                      Question
                    </span>
                  }>
                  <div className="space-y-1">
                    <Input value={question.question} disabled />
                    <Input
                      placeholder="Enter Answer"
                      value={answeredQuestions[index].answer}
                      onChange={e => handleAnswerChange(e.target.value, index)}
                    />
                  </div>
                  {error && (
                    <Alert
                      type="error"
                      message="Your answer was incorrect, try again!"
                      showIcon
                      className="mt-2"
                    />
                  )}
                </Form.Item>
              );
            })}
          </Form>
        </div>
      )}
      {!show && !questionMutation.isPending && (
        <>
          <Divider className="my-8" />
          <div className="flex items-center justify-end">
            <Button
              type="primary"
              size="large"
              className="w-48"
              shape="round"
              loading={loading}
              onClick={handleSubmit}
              disabled={!isFormValid}>
              Next
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default SecurityQuestions;
