import type { FC, RefObject } from "react";
import { useLocalStorage } from "react-use";

import { Link, Onboarding } from "@promo-shock/ui-kit";

type Props = {
  open: boolean;
  addMoreElRef: RefObject<HTMLButtonElement | null>;
  fieldsElRef: RefObject<HTMLDivElement | null>;
  addressesElRef: RefObject<HTMLDivElement | null>;
  actionButtonElRef: RefObject<HTMLButtonElement | null>;
  creationPriceString?: string;
  onClose: () => void;
};

const NewPromoOnboarding: FC<Props> = ({
  open,
  addMoreElRef,
  fieldsElRef,
  addressesElRef,
  actionButtonElRef,
  creationPriceString,
  onClose,
}) => {
  const [onboardingHasFinished, setOnboardingHasFinished] = useLocalStorage(
    "onboardingHasFinished",
    false,
  );
  const handleClose = () => {
    setOnboardingHasFinished(true);
    onClose();
  };
  const handleFinish = () => {
    if (!onboardingHasFinished) setOnboardingHasFinished(true);
  };

  return (
    <Onboarding
      steps={[
        {
          title: "How it works",
          description:
            "Tickets for streams are special tokens (SBTs). When someone buys a ticket, like for a cooking stream, they receive a unique digital token (NFT) indicating their interest. Want to sell kitchen products? Target ads to viewers of that stream, even without knowing their details. Just use our SDK tool, create an ad on PromoShock, and reach new audiences.",
        },
        {
          title: "Step 1",
          description: (
            <>
              Choose the audience you want to target for your promo. To do this,
              go to the{" "}
              <Link external href="/streams?filters=all">
                streams page
              </Link>{" "}
              and copy the ticket address
            </>
          ),
          target: () => addressesElRef.current!,
        },
        {
          title: "Step 2",
          description: (
            <>
              You can add up to 10 audiences. To do this click the &quot;Add
              address&quot; button. 1 audience costs{" "}
              {creationPriceString || "(loading...)"}.
            </>
          ),
          target: () => addMoreElRef.current!,
        },
        {
          title: "Step 3",
          description:
            "Fill in the remaining fields and upload a cover for your promo.",
          target: () => fieldsElRef.current!,
        },
        {
          title: "Step 4",
          description:
            "Launch your promo! It will be displayed a few minutes after posting.",
          target: () => actionButtonElRef.current!,
        },
      ]}
      open={open || !onboardingHasFinished}
      onClose={handleClose}
      onFinish={handleFinish}
    />
  );
};

export { NewPromoOnboarding };
