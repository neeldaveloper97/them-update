'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, Star, Users, Crown, AlertCircle, Loader2 } from 'lucide-react';
import { fetchPlans } from '@/store/slices/plansSlice';
import { checkoutService } from '@/services/planService';
import { Icon } from '@iconify/react';
import GlobalLoader from '@/components/GlobalLoader';

export default function NegotiatePlanPage() {
  const dispatch = useDispatch();
  const { plans } = useSelector((state) => state.plans);
  const [selected, setSelected] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const [userId, setUserId] = useState(null);
  const [billId, setBillId] = useState(null);
  const [agentId, setAgentId] = useState(null);

  useEffect(() => {
    const u = sessionStorage.getItem('chatUserId');
    const b = sessionStorage.getItem('billId');
    const a = sessionStorage.getItem('agent');
    setUserId(u);
    setBillId(b);
    setAgentId(a);
    if (a) dispatch(fetchPlans(a));
  }, [dispatch]);

  const successUrl = `user/bill-upload`;
  const cancelUrl = `user/plans`;

  const getPlanVisuals = (name) => {
    switch (name) {
      case 'Starter':
        return {
          icon: <Users className="w-8 h-8" />,
          bg: 'bg-emerald-100',
          color: 'text-emerald-600',
        };
      case 'Family':
        return {
          icon: <Users className="w-8 h-8" />,
          bg: 'bg-blue-100',
          color: 'text-blue-600',
        };
      case 'Premium Care':
        return {
          icon: <Crown className="w-8 h-8" />,
          bg: 'bg-purple-100',
          color: 'text-purple-600',
        };
      default:
        return {
          icon: <Users className="w-8 h-8" />,
          bg: 'bg-gray-100',
          color: 'text-gray-500',
        };
    }
  };

  const handlePayment = async () => {
    if (!selected || !userId) return;
    setLoadingCheckout(true);
    try {
      const res = await checkoutService.createCheckoutSession(
        userId,
        selected.plan_id,
        selected.lookup_key,
        successUrl,
        cancelUrl
      );
      if (res.url) window.location.href = res.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      <GlobalLoader />
      <div className="min-h-[calc(100vh_-_250px)]">
        <div className="max-w-7xl mx-auto w-full md:px-4">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold text-org-primary-dark mb-16">
              Choose Your Plan
            </h1>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-10 lg:gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mb-12">
            {plans.map((plan) => {
              const isSelected = selected?.plan_id === plan.plan_id;
              const visuals = getPlanVisuals(plan.name);

              return (
                <Card
                  key={plan.plan_id}
                  onClick={() => setSelected(plan)}
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 !shadow-1 ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-xl border-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CardContent className="flex flex-col h-full">
                    <div className="text-center py-4">
                      <h2 className="text-org-primary-dark text-lg font-bold">
                        {plan.name}
                      </h2>
                      <div className="flex items-baseline justify-center gap-1 pt-5">
                        <span className="text-4xl font-bold text-org-primary-light-100">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600 text-sm">/month</span>
                      </div>
                      {plan.contract_label && (
                        <p className="text-xs text-muted-text font-bold mt-1 font-medium">
                          {plan.contract_label}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-gray-500">
                          Included
                        </h4>
                        {plan.included_features.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="text-org-primary-light-100">
                              <Icon
                                icon="lucide:badge-check"
                                width="16"
                                height="16"
                              />
                            </span>
                            <p className="flex-1">{f}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-7">
                        {plan.overage_features.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-gray-500">
                              Overage / Performance
                            </h4>
                            {plan.overage_features.map((o, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-700"
                              >
                                <span className="text-org-primary-light-100">
                                  <Icon
                                    icon="lucide:badge-check"
                                    width="16"
                                    height="16"
                                  />
                                </span>
                                <p className="flex-1">{o}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(plan);
                        }}
                        className={`w-full py-3 font-semibold ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-primary-light-100 hover:bg-primary-dark text-white border border-gray-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose Plan'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handlePayment}
              disabled={!selected || loadingCheckout}
              className="px-8 py-3 text-lg font-semibold bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCheckout ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                'Continue to Payment'
              )}
            </Button>
            {selected && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: <span className="font-semibold">{selected.name}</span>{' '}
                Plan
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
