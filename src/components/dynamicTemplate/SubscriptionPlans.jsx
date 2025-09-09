import DoctorIcon from '@/app/assets/svg/icon_doctor.svg';
import EmployeeIcon from '@/app/assets/svg/icon_employee.svg';
import IndividualIcon from '@/app/assets/svg/icon_individual.svg';
import PricingModulePattern from '@/app/assets/svg/pricing_module_pattern.svg';
import { BadgeCheck } from 'lucide-react';

const PlanCard = ({
  title,
  description,
  features,
  price,
  priceUnit,
  iconBg,
  icon,
  iconColor,
}) => (
  <div className="bg-white p-6 rounded-3xl shadow-1 shadow-[#33ACC133] overflow-hidden transition-transform flex flex-col">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 ${iconBg} ${iconColor} w-fit rounded-full`}>
        {icon}
      </div>
      <div>
        <h5 className="text-xl font-bold leading-6 text-primary-color-dark">
          {title}
        </h5>
        <p className="text-sm leading-6 text-muted-text">{description}</p>
      </div>
    </div>

    <ul className="pt-5 space-y-4 flex-1">
      {features.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-2 py-3 border-b border-dashed border-[#004C5933]"
        >
          <BadgeCheck className="text-primary-color" size={18} />
          <p className="flex-1 text-xs font-normal text-muted-text">
            {item.info}
          </p>
        </li>
      ))}
    </ul>

    <div className="pt-10">
      <div className="flex items-start">
        <p className="text-primary-dark text-base font-semibold pt-1.5">$</p>
        <p>
          <span className="text-4xl font-semibold text-primary-dark">
            {price}
          </span>
          <span className="ml-2 text-base text-muted-text">{priceUnit}</span>
        </p>
      </div>
      {/* <div className="pt-6">
        <Button asChild variant="outline" className="border border-[#004C5933]">
          <Link href={``}>Purchase Now</Link>
        </Button>
      </div> */}
    </div>
  </div>
);

const SubscriptionPlans = ({ subscriptionSectionData }) => {
  return (
    <section className="relative py-24 overflow-hidden bg-linear-to-b from-primary-transparent to-white">
      <div className="absolute bottom-20 left-0 w-[244px] h-[481px]">
        <img
          className="object-cover w-full h-full"
          src={PricingModulePattern.src}
          alt=""
        />
      </div>
      <div className="container">
        <div className="w-full max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-primary-color-dark leading-11">
            {subscriptionSectionData?.title}
          </h3>
          <p className="pt-2 text-base text-center text-muted-text">
            {subscriptionSectionData?.description}
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-6 pt-12 lg:grid-cols-3">
          {(subscriptionSectionData?.plans || plans).map((plan, i) => {
            if (subscriptionSectionData?.plans) {
              const iconMap = {
                person: IndividualIcon,
                medical: DoctorIcon,
                business: EmployeeIcon,
              };

              return (
                <PlanCard
                  key={i}
                  title={plan.title}
                  description={plan.description}
                  features={plan.features.map((feature) => ({
                    info: (
                      <>
                        <strong>{feature.split(' – ')[0]} –</strong>{' '}
                        {feature.split(' – ')[1]}
                      </>
                    ),
                  }))}
                  price={plan.pricing?.amount}
                  priceUnit={
                    plan.pricing?.unit
                      ? `/${plan.pricing.unit}`
                      : plan.pricing?.text
                  }
                  icon={plan.icon}
                  iconBg={plan.iconBg}
                  iconColor={plan.iconColor}
                />
              );
            }

            return <PlanCard key={i} {...plan} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
