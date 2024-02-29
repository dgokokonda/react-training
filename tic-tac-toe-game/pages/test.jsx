import { UseRefTest } from "../components/hooks/use-ref-test";
import { UseReducerTest } from "../components/hooks/use-reducer-test";
import { UseContextTest } from "../components/hooks/use-context-test";
import { UseReducerContextTest } from "../components/hooks/use-reducer-context-test";
import { UseEffectTest } from "../components/hooks/use-effect-test";

export default function TestPage() {
  return (
    <>
      <h2>Test</h2>
      <UseRefTest />
      <UseReducerTest />
      <UseContextTest />
      <UseReducerContextTest />
      <UseEffectTest />
    </>
  );
  // return <div className="text-7xl text-red-800">Test Page</div>
}
