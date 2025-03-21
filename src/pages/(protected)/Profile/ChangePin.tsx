import { useState } from "react";
import SecurityQuestions from "./SecurityQuestions";
import ChangePinForm from "./ChangePinForm";

const ChangePin = () => {
  const [showPinForm, setShowPinForm] = useState(false);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-grey-700">
          Security Questions
        </h3>
        <p className="text-grey-500">
          Answer the security questions to change your pin
        </p>
      </header>

      <SecurityQuestions show={showPinForm} next={() => setShowPinForm(true)} />
      {showPinForm && <ChangePinForm reset={() => setShowPinForm(false)} />}
    </div>
  );
};

export default ChangePin;
