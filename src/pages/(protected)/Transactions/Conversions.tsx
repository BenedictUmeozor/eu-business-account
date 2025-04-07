import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "@/hooks/use-shared-query-action";
import useTransactionFilter from "@/hooks/use-transaction-filter";
import { Button, Tag, Table, Space, message } from "antd";
import type { TableProps } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import clsx from "clsx";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ListFilter,
  RefreshCwIcon,
  UploadIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExportModalRef from "./ExportModalRef";
import TransactionFilter from "./components/TransactionFilter";
import { getErrorMessage } from "@/utils";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import useStatusStyle from "@/hooks/use-status-style";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Conversions = () => {
  const [show, setShow] = useState(false);
  const [tableState, setTableState] = useState<HM.TableState<HM.Transaction>>();
  const {
    fromDate,
    toDate,
    currency,
    status,
    setFromDate,
    setToDate,
    setCurrency,
    setStatus,
  } = useTransactionFilter();
  const { getStatusStyle } = useStatusStyle();
  const [parent] = useAutoAnimate();

  const mutation = useSharedMutationAction<
    {
      transaction: { data: HM.Transaction[] };
      pagination: HM.Pagination;
    },
    HM.TransactionFilter
  >({
    url: ENDPOINTS.FILTER_TRANSACTIONS,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    if ((fromDate && toDate) || currency || status) {
      const filterParams: Partial<HM.TransactionFilter> = {
        category: "Conversion",
        page: tableState?.pagination?.current || 1,
        row_per_page: 15,
      };

      if (fromDate) filterParams.from = fromDate;
      if (toDate) filterParams.to = toDate;
      if (currency) filterParams.currency = currency;
      if (status) filterParams.transaction_status = status;

      mutation.mutateAsync(filterParams as HM.TransactionFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, currency, status, tableState?.pagination?.current]);

  const { data, isPending } = useSharedQueryAction<{
    transaction: { data: HM.Transaction[] };
    pagination: HM.Pagination;
  }>({
    url: ENDPOINTS.GET_CONVERSIONS(tableState?.pagination?.current),
    key: ["conversions", tableState?.pagination?.current],
  });

  const exportRef = useRef<HM.ModalRefObject>(null);

  const transactions: HM.Transaction[] | undefined = useMemo(() => {
    if (fromDate || toDate || currency || status) {
      return mutation?.data?.transaction?.data || [];
    }
    return data?.transaction?.data || [];
  }, [data, mutation.data, fromDate, toDate, currency, status]);

  const columns: TableProps<HM.Transaction>["columns"] = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      className: "text-grey-500 text-sm",
      sorter: (a, b) => a.date.localeCompare(b.date),
      sortDirections: ["ascend", "descend"],
      render: (_, record) => (
        <Space>
          <div className="h-7 w-7 rounded-full grid place-items-center bg-primary-50 relative">
            <RefreshCwIcon className="h-4 w-4 text-primary" />
            {record.type.toLowerCase() === "credit" ? (
              <div className="absolute -bottom-1 right-0 flex rounded-full w-4 h-4 bg-positive-50 items-center justify-center">
                <ArrowDownIcon className="h-3 w-3 text-positive" />
              </div>
            ) : (
              <div className="absolute -bottom-1 right-0 flex rounded-full w-4 h-4 bg-negative-50 items-center justify-center">
                <ArrowUpIcon className="h-3 w-3 text-negative" />
              </div>
            )}
          </div>
          <span className="text-grey-700 text-sm">{record.date}</span>
        </Space>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "reference",
      key: "reference",
      className: "text-grey-500 text-sm",
      render: () => "HLM33140001",
    },
    {
      title: "Currency pair",
      dataIndex: "currency_pair",
      key: "currency_pair",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance Before",
      dataIndex: "balance_before",
      key: "balance_before",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Balance after",
      dataIndex: "balance_after",
      key: "balance_after",
      className: "text-grey-500 text-sm",
    },
    {
      title: "Status",
      dataIndex: "transaction_status",
      key: "transaction_status",
      render: status => (
        <Tag className={clsx(getStatusStyle(status))}>
          {status || "Completed"}
        </Tag>
      ),
    },
  ];

  const rowSelection: TableRowSelection<HM.Transaction> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <section className="space-y-4" ref={parent}>
      {show && (
        <TransactionFilter
          onClose={() => setShow(false)}
          fromDate={fromDate}
          toDate={toDate}
          currency={currency}
          status={status}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setCurrency={setCurrency}
          setStatus={setStatus}
          resetMutation={mutation.reset}
        />
      )}

      <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
        <h5 className="text-grey-600 font-medium text-base">
          Recent Conversions
        </h5>
        <Space>
          <Button
            type="primary"
            onClick={() => exportRef.current?.openModal()}
            icon={<UploadIcon className="h-4 w-4 text-grey-500" />}
            className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200">
            Export
          </Button>

          <Button
            type="primary"
            icon={<ListFilter className="h-4 w-4 text-grey-500" />}
            className="text-sm font-medium text-grey-500 bg-gray-50 border-grey-200"
            onClick={() => setShow(true)}>
            Filter
          </Button>
        </Space>
      </div>
      <div>
        <Table
          dataSource={transactions}
          columns={columns}
          rowSelection={rowSelection}
          loading={isPending || mutation.isPending}
          pagination={{
            current: tableState?.pagination?.current || 1,
            pageSize: 15,
            total: mutation?.data?.pagination
              ? mutation?.data?.pagination?.total_record
              : data?.pagination?.total_record || 0,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          onChange={(pagination, filters, sorter, extra) => {
            setTableState({ pagination, filters, sorter, extra });
          }}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} className="text-grey-500 font-medium text-xs" />
              ),
            },
          }}
        />
      </div>
      <ExportModalRef ref={exportRef} />
    </section>
  );
};

export default Conversions;
